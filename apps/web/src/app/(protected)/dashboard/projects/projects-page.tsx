"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { orpc } from "@/utils/orpc";
import formatPrice from "@/utils/price-formatter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Star,
  Building2,
  Home,
  Landmark,
  Trees,
  Wheat,
  CircleDot,
  ArrowUp,
  ArrowDown,
  FolderOpen,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

type ProjectType =
  | "ESTATE"
  | "LAND"
  | "PROPERTY"
  | "BUILDING"
  | "FARM"
  | "OTHER";

type ProjectStatus =
  | "DRAFT"
  | "FUNDING"
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED";

type SortBy =
  | "name"
  | "createdAt"
  | "updatedAt"
  | "targetAmount"
  | "raisedAmount"
  | "status"
  | "type";

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "FUNDING", label: "Funding" },
  { value: "ACTIVE", label: "Active" },
  { value: "PAUSED", label: "Paused" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "FAILED", label: "Failed" },
] as const;

const TYPE_OPTIONS = [
  { value: "ESTATE", label: "Estate" },
  { value: "LAND", label: "Land" },
  { value: "PROPERTY", label: "Property" },
  { value: "BUILDING", label: "Building" },
  { value: "FARM", label: "Farm" },
  { value: "OTHER", label: "Other" },
] as const;

const SORT_OPTIONS = [
  { value: "createdAt", label: "Created Date" },
  { value: "name", label: "Name" },
  { value: "targetAmount", label: "Target Amount" },
  { value: "raisedAmount", label: "Raised Amount" },
  { value: "status", label: "Status" },
  { value: "type", label: "Type" },
] as const;

const STATUS_STYLES: Record<ProjectStatus, string> = {
  DRAFT: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  FUNDING: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  ACTIVE:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  PAUSED:
    "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  COMPLETED:
    "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  CANCELLED: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  FAILED: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
};

const TYPE_ICONS: Record<ProjectType, React.ElementType> = {
  ESTATE: Landmark,
  LAND: Trees,
  PROPERTY: Home,
  BUILDING: Building2,
  FARM: Wheat,
  OTHER: CircleDot,
};

function getLabel(
  options: readonly { value: string; label: string }[],
  value: string | null,
) {
  if (!value) return undefined;
  return options.find((o) => o.value === value)?.label;
}

function formatCompactAmount(amount: string | null) {
  if (!amount) return "N/A";
  const num = parseFloat(amount);
  if (isNaN(num)) return "N/A";
  return formatPrice(num);
} 

const ITEMS_PER_PAGE = 12;

export default function ProjectsPage() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<ProjectType | null>(null);
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const hasActiveFilters = typeFilter !== null || statusFilter !== null;

  const { data, isLoading, error, refetch } = useQuery(
    orpc.project.admin.getAll.queryOptions({
      input: {
        ...(typeFilter ? { type: typeFilter } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
        sortBy,
        sortOrder,
        page,
        limit: ITEMS_PER_PAGE,
      },
    }),
  );

  const clearFilters = () => {
    setTypeFilter(null);
    setStatusFilter(null);
    setPage(1);
  };

  return (
    <div className="px-4 py-6 container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold">Projects</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {error
              ? "Error loading projects"
              : isLoading
                ? "Loading..."
                : `${data?.pagination.total ?? 0} total projects`}
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button size="xs">
            <Plus className="size-3.5" data-icon="inline-start" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
        <div className="order-1 lg:order-2">
          <FilterPanel
            typeFilter={typeFilter}
            statusFilter={statusFilter}
            sortBy={sortBy}
            sortOrder={sortOrder}
            hasActiveFilters={hasActiveFilters}
            onTypeChange={(v) => {
              setTypeFilter(v);
              setPage(1);
            }}
            onStatusChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
            onClearFilters={clearFilters}
          />
        </div>

        <div className="order-2 lg:order-1">
          {error ? (
            <ErrorState message={error.message} onRetry={() => refetch()} />
          ) : isLoading ? (
            <ProjectListSkeleton />
          ) : !data?.items.length ? (
            <EmptyState
              hasFilters={hasActiveFilters}
              onClearFilters={clearFilters}
            />
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                {data.items.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
              {data.pagination.totalPages > 1 && (
                <Pagination
                  pagination={data.pagination}
                  onPageChange={setPage}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterPanel({
  typeFilter,
  statusFilter,
  sortBy,
  sortOrder,
  hasActiveFilters,
  onTypeChange,
  onStatusChange,
  onSortByChange,
  onSortOrderChange,
  onClearFilters,
}: {
  typeFilter: ProjectType | null;
  statusFilter: ProjectStatus | null;
  sortBy: SortBy;
  sortOrder: "asc" | "desc";
  hasActiveFilters: boolean;
  onTypeChange: (v: ProjectType | null) => void;
  onStatusChange: (v: ProjectStatus | null) => void;
  onSortByChange: (v: SortBy) => void;
  onSortOrderChange: (v: "asc" | "desc") => void;
  onClearFilters: () => void;
}) {
  return (
    <div className="bg-card ring-foreground/10 ring-1 p-4 space-y-4 lg:sticky lg:top-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <X className="size-3" />
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Status
          </label>
          <Select
            value={statusFilter ?? "ALL"}
            onValueChange={(val) =>
              onStatusChange(
                val === "ALL" || val === null
                  ? null
                  : (val as ProjectStatus),
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Statuses">
                {statusFilter
                  ? getLabel(STATUS_OPTIONS, statusFilter)
                  : "All Statuses"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Type
          </label>
          <Select
            value={typeFilter ?? "ALL"}
            onValueChange={(val) =>
              onTypeChange(
                val === "ALL" || val === null ? null : (val as ProjectType),
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Types">
                {typeFilter
                  ? getLabel(TYPE_OPTIONS, typeFilter)
                  : "All Types"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              {TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t border-foreground/5 pt-3 space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Sort By
          </label>
          <Select
            value={sortBy}
            onValueChange={(val) => val && onSortByChange(val as SortBy)}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {getLabel(SORT_OPTIONS, sortBy) ?? "Created Date"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Order
          </label>
          <div className="flex gap-1">
            <Button
              variant={sortOrder === "desc" ? "secondary" : "ghost"}
              size="xs"
              className="flex-1 gap-1.5"
              onClick={() => onSortOrderChange("desc")}
            >
              <ArrowDown className="size-3" />
              Newest
            </Button>
            <Button
              variant={sortOrder === "asc" ? "secondary" : "ghost"}
              size="xs"
              className="flex-1 gap-1.5"
              onClick={() => onSortOrderChange("asc")}
            >
              <ArrowUp className="size-3" />
              Oldest
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Record<string, any> }) {
  const status = project.status as ProjectStatus;
  const type = project.type as ProjectType;
  const TypeIcon = TYPE_ICONS[type] ?? CircleDot;

  const raised = parseFloat(project.raisedAmount ?? "0");
  const target = parseFloat(project.targetAmount ?? "0");
  const progress = target > 0 ? Math.min((raised / target) * 100, 100) : 0;

  const location = [project.city, project.state].filter(Boolean).join(", ");

  const createdDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString("en-NG", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <a
      href={`/admin/projects/${project.id}`}
      className="block bg-card ring-foreground/10 ring-1 p-4 hover:ring-foreground/20 transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="shrink-0 mt-0.5 size-8 flex items-center justify-center bg-muted rounded-md">
            <TypeIcon className="size-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-medium truncate group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span
                className={cn(
                  "inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                  STATUS_STYLES[status],
                )}
              >
                {status}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                {getLabel(TYPE_OPTIONS, type)}
              </span>
              {location && (
                <>
                  <span className="text-muted-foreground/40">|</span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                    <MapPin className="size-2.5" />
                    {location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {project.isFeatured && (
          <Star className="size-3.5 text-amber-500 fill-amber-500 shrink-0 mt-1" />
        )}
      </div>

      <div className="mt-3 pl-11">
        <div className="flex items-baseline justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">
            {formatCompactAmount(project.raisedAmount)}{" "}
            <span className="text-muted-foreground/60">of</span>{" "}
            {formatCompactAmount(project.targetAmount)}
          </span>
          <span className="text-xs font-medium tabular-nums">
            {progress.toFixed(0)}%
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              progress >= 100
                ? "bg-emerald-500"
                : progress >= 50
                  ? "bg-blue-500"
                  : "bg-primary",
            )}
            style={{ width: `${progress}%` }}
          />
        </div>

        {createdDate && (
          <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
            <Calendar className="size-2.5" />
            {createdDate}
          </div>
        )}
      </div>
    </a>
  );
}

function Pagination({
  pagination,
  onPageChange,
}: {
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange: (page: number) => void;
}) {
  const { page, totalPages, hasNextPage, hasPreviousPage } = pagination;

  const pages: (number | "ellipsis")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("ellipsis");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between pt-2">
      <p className="text-xs text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-xs"
          disabled={!hasPreviousPage}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="size-4" />
        </Button>
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span
              key={`ellipsis-${i}`}
              className="px-1 text-xs text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <Button
              key={p}
              variant={p === page ? "secondary" : "ghost"}
              size="icon-xs"
              onClick={() => onPageChange(p)}
              className="text-xs tabular-nums"
            >
              {p}
            </Button>
          ),
        )}
        <Button
          variant="ghost"
          size="icon-xs"
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function ProjectListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-card ring-foreground/10 ring-1 p-4">
          <div className="flex items-start gap-3">
            <Skeleton className="size-8 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
          <div className="mt-3 pl-11 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  hasFilters,
  onClearFilters,
}: {
  hasFilters: boolean;
  onClearFilters: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="size-12 flex items-center justify-center bg-muted rounded-full mb-4">
        <FolderOpen className="size-6 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-medium mb-1">
        {hasFilters ? "No matching projects" : "No projects yet"}
      </h3>
      <p className="text-xs text-muted-foreground max-w-xs">
        {hasFilters
          ? "Try adjusting your filters to find what you're looking for."
          : "Get started by creating your first project."}
      </p>
      <div className="mt-4">
        {hasFilters ? (
          <Button variant="outline" size="xs" onClick={onClearFilters}>
            <X className="size-3" data-icon="inline-start" />
            Clear Filters
          </Button>
        ) : (
          <Link href="/admin/projects/new">
            <Button size="xs">
              <Plus className="size-3" data-icon="inline-start" />
              New Project
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="size-12 flex items-center justify-center bg-destructive/10 rounded-full mb-4">
        <AlertCircle className="size-6 text-destructive" />
      </div>
      <h3 className="text-sm font-medium mb-1">Failed to load projects</h3>
      <p className="text-xs text-muted-foreground max-w-xs mb-4">{message}</p>
      <Button variant="outline" size="xs" onClick={onRetry}>
        <RotateCcw className="size-3" data-icon="inline-start" />
        Try again
      </Button>
    </div>
  );
}
