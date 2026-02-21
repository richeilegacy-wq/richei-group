"use client";

import { useState, Fragment } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Check,
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createProjectSchema } from "@richei-group/validators";
import { orpc } from "@/utils/orpc";
import { cn } from "@/lib/utils";
import {
  validateMinMaxInvestment,
  validateDateOrder,
  validatePositiveNumericString,
  validateSlug,
  validatePenaltyRate,
} from "./steps/_types";
import type {
  ProjectFormValues,
  RevenueStreamValue,
  ReturnStructureValue,
  FeeValue,
  MilestoneValue,
  DocumentValue,
  MediaValue,
  TokenValue,
} from "./steps/_types";

import OverviewStep from "./steps/overview-step";
import LocationStep from "./steps/location-step";
import InvestmentStep from "./steps/investment-step";
import RevenueStep from "./steps/revenue-step";
import MilestonesStep from "./steps/milestones-step";
import MediaStep from "./steps/media-step";
import ReviewStep from "./steps/review-step";

const STEPS = [
  { label: "Overview" },
  { label: "Location" },
  { label: "Investment" },
  { label: "Revenue" },
  { label: "Milestones" },
  { label: "Media" },
  { label: "Review" },
];

function cleanFormData(values: ProjectFormValues) {
  const data: Record<string, unknown> = {
    name: values.name,
    slug: values.slug,
    type: values.type,
    targetAmount: values.targetAmount,
    status: values.status || "DRAFT",
    currency: values.currency || "NGN",
    country: values.country || "Nigeria",
    earlyExitAllowed: values.earlyExitAllowed,
    secondaryMarketEnabled: values.secondaryMarketEnabled,
    isFeatured: values.isFeatured,
  };

  const optionalStrings = [
    "description",
    "summary",
    "ownershipType",
    "address",
    "city",
    "state",
    "latitude",
    "longitude",
    "minInvestment",
    "maxInvestment",
    "riskLevel",
    "earlyExitPenaltyRate",
  ] as const;

  for (const key of optionalStrings) {
    if (values[key]) data[key] = values[key];
  }

  if (values.underfundingPolicy)
    data.underfundingPolicy = values.underfundingPolicy;
  if (values.earlyExitNoticeDays != null)
    data.earlyExitNoticeDays = values.earlyExitNoticeDays;

  const dateFields = [
    "fundingDeadline",
    "startDate",
    "endDate",
    "exitDate",
  ] as const;
  for (const key of dateFields) {
    if (values[key]) data[key] = new Date(values[key]);
  }

  if (values.revenueStreams?.length)
    data.revenueStreams = values.revenueStreams;
  if (values.returnStructures?.length)
    data.returnStructures = values.returnStructures;
  if (values.fees?.length) data.fees = values.fees;
  if (values.milestones?.length) {
    data.milestones = values.milestones.map((m) => ({
      ...m,
      targetDate: m.targetDate ? new Date(m.targetDate) : undefined,
    }));
  }
  if (values.documents?.length) data.documents = values.documents;
  if (values.media?.length) data.media = values.media;
  if (values.tokens?.length) data.tokens = values.tokens;

  return data;
}

const NewProject = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepErrors, setStepErrors] = useState<Record<number, string[]>>({});

  const createMutation = useMutation(
    orpc.project.admin.create.mutationOptions({
      onSuccess: () => {
        toast.success("Project created successfully");
        router.push("/admin/projects");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      summary: "",
      type: "",
      status: "DRAFT",
      ownershipType: "",
      address: "",
      city: "",
      state: "",
      country: "Nigeria",
      latitude: "",
      longitude: "",
      currency: "NGN",
      targetAmount: "",
      minInvestment: "",
      maxInvestment: "",
      fundingDeadline: "",
      underfundingPolicy: "REFUND_ALL",
      startDate: "",
      endDate: "",
      exitDate: "",
      riskLevel: "",
      earlyExitAllowed: false,
      earlyExitPenaltyRate: "",
      earlyExitNoticeDays: undefined as number | undefined,
      secondaryMarketEnabled: false,
      isFeatured: false,
      revenueStreams: [] as RevenueStreamValue[],
      returnStructures: [] as ReturnStructureValue[],
      fees: [] as FeeValue[],
      milestones: [] as MilestoneValue[],
      documents: [] as DocumentValue[],
      media: [] as MediaValue[],
      tokens: [] as TokenValue[],
    },
    onSubmit: async ({ value }) => {
      const cleaned = cleanFormData(value as unknown as ProjectFormValues);
      const result = createProjectSchema.safeParse(cleaned);
      if (!result.success) {
        for (const issue of result.error.issues) {
          toast.error(`${issue.path.join(".")}: ${issue.message}`);
        }
        return;
      }
      createMutation.mutate(result.data);
    },
  });

  /**
   * Stricter step validation that returns an array of error messages.
   * Empty array = step is valid.
   */
  const validateStep = (step: number): string[] => {
    const values = form.state.values;
    const errors: string[] = [];

    switch (step) {
      case 0: {
        // Overview
        if (!values.name || !values.name.trim()) {
          errors.push("Project name is required");
        } else if (values.name.length < 3) {
          errors.push("Project name must be at least 3 characters");
        }
        if (!values.slug || !values.slug.trim()) {
          errors.push("URL slug is required");
        } else {
          const slugErr = validateSlug(values.slug);
          if (slugErr) errors.push(`Slug: ${slugErr}`);
        }
        if (!values.type) {
          errors.push("Project type is required");
        }
        break;
      }
      case 1: {
        // Location — all optional, no blocking validation
        break;
      }
      case 2: {
        // Investment & Timeline
        if (!values.targetAmount) {
          errors.push("Target amount is required");
        } else {
          const amtErr = validatePositiveNumericString(values.targetAmount);
          if (amtErr) errors.push(`Target amount: ${amtErr}`);
        }

        // Cross-field: min/max investment
        const invErrors = validateMinMaxInvestment(
          values.minInvestment,
          values.maxInvestment,
          values.targetAmount,
        );
        if (invErrors.minError) errors.push(invErrors.minError);
        if (invErrors.maxError) errors.push(invErrors.maxError);

        // Cross-field: date ordering
        const dateErrors = validateDateOrder(
          values.startDate,
          values.endDate,
          values.exitDate,
          values.fundingDeadline,
        );
        if (dateErrors.startError) errors.push(dateErrors.startError);
        if (dateErrors.endError)
          errors.push(`End date: ${dateErrors.endError}`);
        if (dateErrors.exitError)
          errors.push(`Exit date: ${dateErrors.exitError}`);
        if (dateErrors.fundingError)
          errors.push(`Funding deadline: ${dateErrors.fundingError}`);

        // Penalty rate
        if (values.earlyExitAllowed && values.earlyExitPenaltyRate) {
          const penErr = validatePenaltyRate(values.earlyExitPenaltyRate);
          if (penErr) errors.push(`Penalty rate: ${penErr}`);
        }
        break;
      }
      // Steps 3-5 have optional content, no blocking validation
      default:
        break;
    }

    return errors;
  };

  const handleNext = () => {
    const errors = validateStep(currentStep);
    if (errors.length > 0) {
      setStepErrors((prev) => ({ ...prev, [currentStep]: errors }));
      // Show the first error as a toast for quick visibility
      toast.error(errors[0]);
      return;
    }
    // Clear errors for this step on success
    setStepErrors((prev) => {
      const next = { ...prev };
      delete next[currentStep];
      return next;
    });
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleGoToStep = (step: number) => {
    // Only allow going back or to already-visited steps
    if (step < currentStep) {
      setCurrentStep(step);
      return;
    }
    // Going forward: validate all intermediate steps
    for (let i = currentStep; i < step; i++) {
      const errors = validateStep(i);
      if (errors.length > 0) {
        setStepErrors((prev) => ({ ...prev, [i]: errors }));
        toast.error(`Step "${STEPS[i].label}" has issues: ${errors[0]}`);
        setCurrentStep(i);
        return;
      }
    }
    setCurrentStep(step);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <OverviewStep form={form} />;
      case 1:
        return <LocationStep form={form} />;
      case 2:
        return <InvestmentStep form={form} />;
      case 3:
        return <RevenueStep form={form} />;
      case 4:
        return <MilestonesStep form={form} />;
      case 5:
        return <MediaStep form={form} />;
      case 6:
        return <ReviewStep form={form} onGoToStep={handleGoToStep} />;
      default:
        return null;
    }
  };

  const currentStepErrors = stepErrors[currentStep] ?? [];

  return (
    <div className="px-4 lg:px-8 py-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Create New Project
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Fill in the details to add a new investment project
        </p>
      </div>

      <nav className="hidden lg:flex items-center mb-8">
        {STEPS.map((step, index) => (
          <Fragment key={step.label}>
            <button
              type="button"
              onClick={() => index <= currentStep && handleGoToStep(index)}
              disabled={index > currentStep}
              className={cn(
                "flex flex-col items-center gap-2 shrink-0",
                index <= currentStep ? "cursor-pointer" : "cursor-default",
              )}
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                  index < currentStep &&
                    !stepErrors[index]?.length &&
                    "bg-primary border-primary text-primary-foreground",
                  index < currentStep &&
                    !!stepErrors[index]?.length &&
                    "bg-amber-500 border-amber-500 text-white",
                  index === currentStep &&
                    "bg-primary border-primary text-primary-foreground",
                  index > currentStep && "border-gray-300 text-gray-400",
                )}
              >
                {index < currentStep ? (
                  stepErrors[index]?.length ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  "text-[11px] font-medium whitespace-nowrap",
                  index <= currentStep
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </button>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 mb-5",
                  index < currentStep ? "bg-primary" : "bg-gray-200",
                )}
              />
            )}
          </Fragment>
        ))}
      </nav>

      <div className="lg:hidden mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Step {currentStep + 1} of {STEPS.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {STEPS[currentStep].label}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / STEPS.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        {/* Step-level error summary */}
        {currentStepErrors.length > 0 && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-destructive">
                  Please fix the following issues:
                </p>
                <ul className="mt-1 list-disc list-inside text-xs text-destructive/80 space-y-0.5">
                  {currentStepErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="bg-card ring-foreground/10 ring-1 rounded-lg p-6 lg:p-8 min-h-[400px]">
          {renderStep()}
        </div>

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="rounded-lg gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button
              type="button"
              size="lg"
              onClick={handleNext}
              className="rounded-lg gap-2"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <form.Subscribe selector={(state: any) => state.isSubmitting}>
              {(isSubmitting: any) => (
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting || createMutation.isPending}
                  className="rounded-lg gap-2"
                >
                  {isSubmitting || createMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Project"
                  )}
                </Button>
              )}
            </form.Subscribe>
          )}
        </div>
      </form>
    </div>
  );
};

export default NewProject;
