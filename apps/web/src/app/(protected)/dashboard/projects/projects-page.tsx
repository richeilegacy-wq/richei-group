"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "next";
import Link from "next/link";
import { orpc } from "@/utils/orpc";
import formatPrice from "@/utils/price-formatter";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { project, projectMedia, projectReturnStructure, projectRevenueStream } from "@richei-group/db/schema/project";

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
  | "targetAmount"
  | "raisedAmount"
  | "status"
  | "type";

  type ProjectBase = Omit<typeof project.$inferSelect, "createdBy">;
  type ProjectMedia = Pick<
    typeof projectMedia.$inferSelect,
    "id" | "projectId" | "type" | "url" | "altText" | "sortOrder" | "isCover"
  >;
  type Project = ProjectBase & {
    media: ProjectMedia[];
    returnStructures: typeof projectReturnStructure.$inferSelect[];
    revenueStreams: typeof projectRevenueStream.$inferSelect[];
  };

const TYPE_OPTIONS = [
  { value: "ESTATE", label: "Estate" },
  { value: "LAND", label: "Land" },
  { value: "PROPERTY", label: "Property" },
  { value: "BUILDING", label: "Building" },
  { value: "FARM", label: "Farm" },
  { value: "OTHER", label: "Other" },
] as const;

const STATUS_OPTIONS = [
  { value: "FUNDING", label: "Funding" },
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Completed" },
] as const;

const SORT_OPTIONS = [
  { value: "createdAt", label: "Latest" },
  { value: "raisedAmount", label: "Most Funded" },
  { value: "targetAmount", label: "Target Amount" },
] as const;

function formatCompact(numStr: string | null) {
  if (!numStr) return "$0";
  const num = parseFloat(numStr);
  if (isNaN(num)) return "$0";

  if (num >= 1000000) {
    return "$" + (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
    return formatPrice(num)
}

const IMAGE_OR_VIDEO = ["IMAGE", "VIDEO"] as const;

function projectCoverMedia(media: Project["media"]): Project["media"][number] | undefined {
  const cover = media?.find((m) => m.isCover);
  if (cover && IMAGE_OR_VIDEO.includes(cover.type as (typeof IMAGE_OR_VIDEO)[number]))
    return cover;
  return media?.find((m) => IMAGE_OR_VIDEO.includes(m.type as (typeof IMAGE_OR_VIDEO)[number]));
}

function ProjectCard({ project }: { project: Project }) {
  const coverMedia = projectCoverMedia(project.media);
  const placeholderUrl = "/placeholder-image.jpg";

  const target = parseFloat(project.targetAmount || "0");
  const raised = parseFloat(project.raisedAmount || "0");
  const progress = target > 0 ? Math.min((raised / target) * 100, 100) : 0;

  const typeLabel =
    TYPE_OPTIONS.find((t) => t.value === project.type)?.label || project.type;

  const minInvestment = parseFloat(project.minInvestment || "0");
  const formattedMinInvestment =
    minInvestment > 0
      ? formatPrice(minInvestment)
      : "N/A";

  let highlightMetricText = "";
  let highlightMetricLabel = "";
  let highlightMetricColor = "text-emerald-500";

  // Check out return structures/revenue streams to determine the highlighted metric
  if (project.returnStructures && project.returnStructures.length > 0) {
    const rs = project.returnStructures[0];
    if (rs.type === "FIXED_PERCENTAGE" || rs.type === "PROFIT_SHARE") {
      highlightMetricLabel = "Target Return";
      highlightMetricText = rs.rate ? `${rs.rate}%` : "Varies";
    } else if (rs.type === "PERIODIC_RENTAL") {
      highlightMetricLabel = "Distribution";
      highlightMetricText = rs.payoutFrequency
        ? rs.payoutFrequency.charAt(0) +
          rs.payoutFrequency.slice(1).toLowerCase()
        : "Periodic";
      highlightMetricColor = "text-zinc-900 dark:text-zinc-100";
    } else {
      highlightMetricLabel = "Appreciation";
      highlightMetricText = "High Growth";
    }
  } else if (project.revenueStreams && project.revenueStreams.length > 0) {
    const rs = project.revenueStreams[0];
    highlightMetricLabel =
      rs.type === "APPRECIATION" ? "Appreciation" : "Yield";
    highlightMetricText = rs.expectedReturnRate
      ? `${rs.expectedReturnRate}%`
      : "High Growth";
  } else {
    // defaults
    highlightMetricLabel = "Target Return";
    highlightMetricText = "TBD";
    highlightMetricColor = "text-muted-foreground";
  }

  let statusBg = "bg-white text-zinc-900";
  let dotColor = "bg-zinc-400";
  let statusText = "Closed";
  let isDot = false;

  if (project.status === "FUNDING") {
    statusBg = "bg-emerald-100 text-emerald-800";
    dotColor = "bg-emerald-500";
    statusText = "Funding";
    isDot = true;
  } else if (project.status === "ACTIVE") {
    statusBg = "bg-blue-100 text-blue-800";
    statusText = "Active";
  } else if (project.status === "DRAFT") {
    statusBg = "bg-amber-100 text-amber-800";
    statusText = "Coming Soon";
  }

  return (
    <Link
      href={`/dashboard/projects/${project.slug}` as Route}
      className="group flex flex-col bg-card rounded-[20px] ring-1 ring-foreground/10 overflow-hidden hover:ring-foreground/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        {coverMedia?.type === "VIDEO" ? (
          <video
            src={coverMedia.url}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            muted
            loop
            playsInline
            autoPlay
          />
        ) : coverMedia?.type === "IMAGE" ? (
          <img
            src={coverMedia.url}
            alt={coverMedia.altText ?? project.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <img
            src={placeholderUrl}
            alt={project.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-semibold text-zinc-800 shadow-sm">
            {typeLabel}
          </div>
          <div
            className={cn(
              "px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-sm flex items-center gap-1.5",
              statusBg,
            )}
          >
            {isDot && (
              <span className={cn("size-1.5 rounded-full", dotColor)} />
            )}
            {statusText}
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col grow">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-1">
            {project.name}
          </h3>
          <button className="text-muted-foreground hover:text-red-500 transition-colors shrink-0 mt-0.5">
            <Heart className="size-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
          {project.description ||
            "A prime real estate opportunity in our curated portfolio."}
        </p>

        <div className="mt-auto space-y-4">
          <div className="space-y-2">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-muted-foreground">
                {progress >= 100 ? "Funded" : "Raised"}
              </span>
              <span className="text-zinc-900 font-medium dark:text-zinc-100">
                {progress >= 100 ? (
                  "100%"
                ) : (
                  <>
                    {formatCompact(project.raisedAmount)}{" "}
                    <span className="text-muted-foreground font-normal">
                      / {formatCompact(project.targetAmount)}
                    </span>
                  </>
                )}
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  progress >= 100
                    ? "bg-emerald-500"
                    : "bg-zinc-900 dark:bg-zinc-100",
                )}
                style={{ width: `${Math.max(progress, 2)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
            <div>
              <p className="text-[11px] text-muted-foreground mb-1 uppercase tracking-wider font-medium">
                Min. Investment
              </p>
              <p className="text-sm font-bold">{formattedMinInvestment}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-muted-foreground mb-1 uppercase tracking-wider font-medium">
                {highlightMetricLabel}
              </p>
              <p className={cn("text-sm font-bold", highlightMetricColor)}>
                {highlightMetricText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ProjectsPage() {
  const [typeFilter, setTypeFilter] = useState<ProjectType | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "ALL">(
    "ALL",
  );
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");

  const { data, isLoading, error } = useQuery(
    orpc.project.list.queryOptions({
      input: {
        ...(typeFilter !== "ALL" ? { type: typeFilter } : {}),
        ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
        sortBy,
        sortOrder: "desc",
        limit: 20,
      },
    }),
  );

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Projects Page
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Manage and track your real estate investment opportunities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={typeFilter}
            onValueChange={(v) => setTypeFilter(v as any)}
          >
            <SelectTrigger className="w-[140px] h-10 bg-card">
              <SelectValue placeholder="All Types" />
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

          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as any)}
          >
            <SelectTrigger className="w-[140px] h-10 bg-card">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
            <SelectTrigger className="w-[160px] h-10 bg-card">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  Sort By: {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error ? (
        <div className="py-20 text-center text-muted-foreground">
          Error loading projects. Please try again.
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-card rounded-[20px] ring-1 ring-foreground/10 overflow-hidden flex flex-col h-[400px]"
            >
              <Skeleton className="w-full h-48 rounded-none" />
              <div className="p-5 flex flex-col grow space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
                <div className="mt-auto space-y-4">
                  <Skeleton className="h-2 w-full rounded-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : data?.items.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground bg-card rounded-[20px] ring-1 ring-foreground/10">
          No projects found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.items.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
