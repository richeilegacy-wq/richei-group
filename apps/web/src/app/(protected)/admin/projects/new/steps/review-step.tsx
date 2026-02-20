"use client";

import { Button } from "@/components/ui/button";
import { Pencil, ExternalLink } from "lucide-react";
import { useStore } from "@tanstack/react-store";
import type { ReviewStepProps } from "./_types";
import type { ProjectFormValues } from "./_types";

const LABELS: Record<string, string> = {
  ESTATE: "Estate",
  LAND: "Land",
  PROPERTY: "Property",
  BUILDING: "Building",
  FARM: "Farm",
  OTHER: "Other",
  LEGAL_TITLE: "Legal Title",
  PROFIT_PARTICIPATION: "Profit Participation",
  REFUND_ALL: "Refund All",
  PARTIAL_PROCEED: "Partial Proceed",
  EXTEND_DEADLINE: "Extend Deadline",
  RESALE: "Resale",
  LEASE: "Lease",
  FARMING: "Farming",
  RENTAL: "Rental",
  APPRECIATION: "Appreciation",
  FIXED_PERCENTAGE: "Fixed Percentage",
  PROFIT_SHARE: "Profit Share",
  PERIODIC_RENTAL: "Periodic Rental",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  BIANNUALLY: "Biannually",
  YEARLY: "Yearly",
  AT_EXIT: "At Exit",
  ON_SALE: "On Sale",
  UPFRONT: "Upfront",
  ON_PROFIT: "On Profit",
  ON_WITHDRAWAL: "On Withdrawal",
  MANAGEMENT: "Management",
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  DELAYED: "Delayed",
  PARTICIPATION: "Participation",
  OWNERSHIP: "Ownership",
  REWARD: "Reward",
  IMAGE: "Image",
  VIDEO: "Video",
  MAP: "Map",
  FLOOR_PLAN: "Floor Plan",
  SURVEY_PLAN: "Survey Plan",
  ALLOCATION_LETTER: "Allocation Letter",
  DEED: "Deed",
  CONTRACT: "Contract",
  TITLE_CERTIFICATE: "Title Certificate",
};

function label(val: string | undefined | null) {
  if (!val) return "";
  return LABELS[val] || val;
}

function ReviewField({
  name,
  value,
}: {
  name: string;
  value: string | number | boolean | undefined | null;
}) {
  if (value === undefined || value === null || value === "") return null;
  const display =
    typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);
  return (
    <div className="flex gap-4 py-1.5">
      <span className="text-xs text-muted-foreground w-40 shrink-0">
        {name}
      </span>
      <span className="text-sm text-foreground">{display}</span>
    </div>
  );
}

function Section({
  title,
  stepIndex,
  onEdit,
  children,
}: {
  title: string;
  stepIndex: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => onEdit(stepIndex)}
        >
          <Pencil className="w-3.5 h-3.5" />
        </Button>
      </div>
      <div className="border rounded-lg p-4 divide-y divide-gray-100">
        {children}
      </div>
    </div>
  );
}

const ReviewStep = ({ form, onGoToStep }: ReviewStepProps) => {
  const values: ProjectFormValues = useStore(form.store, (s: any) => s.values);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Review Project
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Review all details before creating the project
        </p>
      </div>

      <Section title="Overview" stepIndex={0} onEdit={onGoToStep}>
        <ReviewField name="Name" value={values.name} />
        <ReviewField name="Slug" value={values.slug} />
        <ReviewField name="Type" value={label(values.type)} />
        <ReviewField
          name="Ownership Type"
          value={label(values.ownershipType)}
        />
        <ReviewField name="Summary" value={values.summary} />
        <ReviewField name="Description" value={values.description} />
      </Section>

      <Section title="Location" stepIndex={1} onEdit={onGoToStep}>
        <ReviewField name="Address" value={values.address} />
        <ReviewField name="Local Government" value={values.city} />
        <ReviewField name="State" value={values.state} />
        <ReviewField name="Country" value={values.country} />
        {(values.latitude || values.longitude) && (
          <ReviewField
            name="Coordinates"
            value={`${values.latitude || "N/A"}, ${values.longitude || "N/A"}`}
          />
        )}
      </Section>

      <Section title="Investment & Timeline" stepIndex={2} onEdit={onGoToStep}>
        <ReviewField name="Currency" value={values.currency} />
        <ReviewField name="Target Amount" value={values.targetAmount} />
        <ReviewField name="Min Investment" value={values.minInvestment} />
        <ReviewField name="Max Investment" value={values.maxInvestment} />
        <ReviewField name="Funding Deadline" value={values.fundingDeadline} />
        <ReviewField
          name="Underfunding Policy"
          value={label(values.underfundingPolicy)}
        />
        <ReviewField name="Start Date" value={values.startDate} />
        <ReviewField name="End Date" value={values.endDate} />
        <ReviewField name="Exit Date" value={values.exitDate} />
        <ReviewField name="Risk Level" value={values.riskLevel} />
        <ReviewField name="Early Exit Allowed" value={values.earlyExitAllowed} />
        {values.earlyExitAllowed && (
          <>
            <ReviewField
              name="Exit Penalty Rate"
              value={values.earlyExitPenaltyRate}
            />
            <ReviewField
              name="Exit Notice Days"
              value={values.earlyExitNoticeDays}
            />
          </>
        )}
        <ReviewField
          name="Secondary Market"
          value={values.secondaryMarketEnabled}
        />
        <ReviewField name="Featured" value={values.isFeatured} />
      </Section>

      <Section
        title="Revenue, Returns & Fees"
        stepIndex={3}
        onEdit={onGoToStep}
      >
        {values.revenueStreams?.length > 0 ? (
          <div className="space-y-2 py-1.5">
            <span className="text-xs text-muted-foreground font-medium">
              Revenue Streams
            </span>
            {values.revenueStreams.map((rs, i) => (
              <div key={i} className="text-sm text-foreground pl-4">
                {label(rs.type)}
                {rs.expectedReturnRate && ` - ${rs.expectedReturnRate}% expected`}
                {rs.description && ` (${rs.description})`}
              </div>
            ))}
          </div>
        ) : null}

        {values.returnStructures?.length > 0 ? (
          <div className="space-y-2 py-1.5">
            <span className="text-xs text-muted-foreground font-medium">
              Return Structures
            </span>
            {values.returnStructures.map((rs, i) => (
              <div key={i} className="text-sm text-foreground pl-4">
                {label(rs.type)}
                {rs.rate && ` - ${rs.rate}%`}
                {rs.payoutFrequency && `, ${label(rs.payoutFrequency)}`}
              </div>
            ))}
          </div>
        ) : null}

        {values.fees?.length > 0 ? (
          <div className="space-y-2 py-1.5">
            <span className="text-xs text-muted-foreground font-medium">
              Fees
            </span>
            {values.fees.map((f, i) => (
              <div key={i} className="text-sm text-foreground pl-4">
                {label(f.type)}
                {f.rate && ` - ${f.rate}%`}
                {f.fixedAmount && ` / ${f.fixedAmount} fixed`}
              </div>
            ))}
          </div>
        ) : null}

        {!values.revenueStreams?.length &&
          !values.returnStructures?.length &&
          !values.fees?.length && (
            <p className="text-sm text-muted-foreground py-1.5">
              No revenue, returns, or fees configured
            </p>
          )}
      </Section>

      <Section
        title="Milestones & Tokens"
        stepIndex={4}
        onEdit={onGoToStep}
      >
        {values.milestones?.length > 0 ? (
          <div className="space-y-2 py-1.5">
            <span className="text-xs text-muted-foreground font-medium">
              Milestones
            </span>
            {values.milestones.map((m, i) => (
              <div key={i} className="text-sm text-foreground pl-4">
                {m.name}
                {m.status && ` - ${label(m.status)}`}
                {m.targetDate && ` (target: ${m.targetDate})`}
              </div>
            ))}
          </div>
        ) : null}

        {values.tokens?.length > 0 ? (
          <div className="space-y-2 py-1.5">
            <span className="text-xs text-muted-foreground font-medium">
              Tokens
            </span>
            {values.tokens.map((t, i) => (
              <div key={i} className="text-sm text-foreground pl-4">
                {t.name} ({label(t.tokenType)}) - {t.totalSupply} supply @{" "}
                {t.pricePerToken} {t.currency}
              </div>
            ))}
          </div>
        ) : null}

        {!values.milestones?.length && !values.tokens?.length && (
          <p className="text-sm text-muted-foreground py-1.5">
            No milestones or tokens configured
          </p>
        )}
      </Section>

      <Section
        title="Media & Documents"
        stepIndex={5}
        onEdit={onGoToStep}
      >
        {values.media?.length > 0 ? (
          <div className="space-y-2 py-1.5">
            <span className="text-xs text-muted-foreground font-medium">
              Media
            </span>
            {values.media.map((m, i) => (
              <div
                key={i}
                className="text-sm text-foreground pl-4 flex items-center gap-2"
              >
                <span>
                  {label(m.type)}
                  {m.altText && ` - ${m.altText}`}
                  {m.isCover && " (Cover)"}
                </span>
                {m.url && (
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : null}

        {values.documents?.length > 0 ? (
          <div className="space-y-2 py-1.5">
            <span className="text-xs text-muted-foreground font-medium">
              Documents
            </span>
            {values.documents.map((d, i) => (
              <div
                key={i}
                className="text-sm text-foreground pl-4 flex items-center gap-2"
              >
                <span>
                  {label(d.type)} - {d.name}
                  {d.isPublic ? " (Public)" : " (Private)"}
                </span>
                {d.url && (
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : null}

        {!values.media?.length && !values.documents?.length && (
          <p className="text-sm text-muted-foreground py-1.5">
            No media or documents added
          </p>
        )}
      </Section>
    </div>
  );
};

export default ReviewStep;
