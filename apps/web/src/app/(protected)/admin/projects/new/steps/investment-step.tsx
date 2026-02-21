"use client";

import { formatNumberInput, stripFormatting } from "@/utils/price-formatter";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";
import { useStore } from "@tanstack/react-store";
import type { StepProps } from "./_types";
import {
  inputClass,
  selectClass,
  LABEL_CLASS,
  getOptionLabel,
  validatePositiveNumericString,
  validateNumericString,
  validateMinMaxInvestment,
  validateDateOrder,
  validatePenaltyRate,
} from "./_types";

const UNDERFUNDING_POLICIES = [
  { value: "REFUND_ALL", label: "Refund All" },
  { value: "PARTIAL_PROCEED", label: "Partial Proceed" },
  { value: "EXTEND_DEADLINE", label: "Extend Deadline" },
];

function InlineWarning({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs text-amber-600 mt-1">
      <AlertTriangle className="w-3 h-3 shrink-0" />
      {message}
    </p>
  );
}

const InvestmentStep = ({ form }: StepProps) => {
  const earlyExitAllowed = useStore(
    form.store,
    (s: any) => s.values.earlyExitAllowed,
  );

  const minInvestment = useStore(
    form.store,
    (s: any) => s.values.minInvestment,
  ) as string;
  const maxInvestment = useStore(
    form.store,
    (s: any) => s.values.maxInvestment,
  ) as string;
  const targetAmount = useStore(
    form.store,
    (s: any) => s.values.targetAmount,
  ) as string;

  const startDate = useStore(
    form.store,
    (s: any) => s.values.startDate,
  ) as string;
  const endDate = useStore(form.store, (s: any) => s.values.endDate) as string;
  const exitDate = useStore(
    form.store,
    (s: any) => s.values.exitDate,
  ) as string;
  const fundingDeadline = useStore(
    form.store,
    (s: any) => s.values.fundingDeadline,
  ) as string;

  // Compute cross-field errors
  const investmentErrors = validateMinMaxInvestment(
    minInvestment,
    maxInvestment,
    targetAmount,
  );
  const dateErrors = validateDateOrder(
    startDate,
    endDate,
    exitDate,
    fundingDeadline,
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Investment & Timeline
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Financial details, dates, and project settings.{" "}
          <span className="text-destructive">*</span> marks required fields.
        </p>
      </div>

      {/* ---- Amounts ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form.Field
          name="targetAmount"
          validators={{
            onBlur: ({ value }: { value: string }) => {
              if (!value) return "Target amount is required";
              return validatePositiveNumericString(value) || undefined;
            },
            onChange: ({ value }: { value: string }) => {
              if (value)
                return validatePositiveNumericString(value) || undefined;
              return undefined;
            },
          }}
        >
          {(field: any) => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={hasError ? "true" : undefined}>
                <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
                  Target Amount <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id={field.name}
                  placeholder="e.g. 50,000,000"
                  value={formatNumberInput(field.state.value)}
                  onBlur={field.handleBlur}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(stripFormatting(e.target.value))
                  }
                  className={inputClass(hasError)}
                />
                <FieldDescription>
                  Total funding target for this project in NGN.
                </FieldDescription>
                {hasError && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="currency">
          {(field: any) => (
            <Field>
              <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
                Currency{" "}
                <span className="text-muted-foreground font-normal text-xs">
                  (optional)
                </span>
              </FieldLabel>
              <Input
                id={field.name}
                placeholder="NGN"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.handleChange(e.target.value)
                }
                className={inputClass(false)}
              />
              <FieldDescription>
                Defaults to NGN if left empty.
              </FieldDescription>
            </Field>
          )}
        </form.Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form.Field
          name="minInvestment"
          validators={{
            onBlur: ({ value }: { value: string }) => {
              if (value) return validateNumericString(value) || undefined;
              return undefined;
            },
            onChange: ({ value }: { value: string }) => {
              if (value) return validateNumericString(value) || undefined;
              return undefined;
            },
          }}
        >
          {(field: any) => {
            const fieldError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            const crossError = investmentErrors.minError;
            const hasError = fieldError || !!crossError;
            return (
              <Field data-invalid={hasError ? "true" : undefined}>
                <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
                  Minimum Investment{" "}
                  <span className="text-muted-foreground font-normal text-xs">
                    (optional)
                  </span>
                </FieldLabel>
                <Input
                  id={field.name}
                  placeholder="e.g. 100,000"
                  value={formatNumberInput(field.state.value)}
                  onBlur={field.handleBlur}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(stripFormatting(e.target.value))
                  }
                  className={inputClass(hasError)}
                />
                <FieldDescription>
                  Smallest amount an investor can contribute.
                </FieldDescription>
                {fieldError && <FieldError errors={field.state.meta.errors} />}
                <InlineWarning message={crossError} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field
          name="maxInvestment"
          validators={{
            onBlur: ({ value }: { value: string }) => {
              if (value) return validateNumericString(value) || undefined;
              return undefined;
            },
            onChange: ({ value }: { value: string }) => {
              if (value) return validateNumericString(value) || undefined;
              return undefined;
            },
          }}
        >
          {(field: any) => {
            const fieldError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            const crossError = investmentErrors.maxError;
            const hasError = fieldError || !!crossError;
            return (
              <Field data-invalid={hasError ? "true" : undefined}>
                <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
                  Maximum Investment{" "}
                  <span className="text-muted-foreground font-normal text-xs">
                    (optional)
                  </span>
                </FieldLabel>
                <Input
                  id={field.name}
                  placeholder="e.g. 10,000,000"
                  value={formatNumberInput(field.state.value)}
                  onBlur={field.handleBlur}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(stripFormatting(e.target.value))
                  }
                  className={inputClass(hasError)}
                />
                <FieldDescription>
                  Largest single investment allowed. Must not exceed target
                  amount.
                </FieldDescription>
                {fieldError && <FieldError errors={field.state.meta.errors} />}
                <InlineWarning message={crossError} />
              </Field>
            );
          }}
        </form.Field>
      </div>

      {/* ---- Dates ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form.Field name="fundingDeadline">
          {(field: any) => {
            const crossError = dateErrors.fundingError;
            return (
              <Field data-invalid={crossError ? "true" : undefined}>
                <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
                  Funding Deadline{" "}
                  <span className="text-muted-foreground font-normal text-xs">
                    (optional)
                  </span>
                </FieldLabel>
                <Input
                  id={field.name}
                  type="date"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(e.target.value)
                  }
                  className={inputClass(!!crossError)}
                />
                <FieldDescription>
                  Last date to receive investor funds. Should be on or before
                  the start date.
                </FieldDescription>
                <InlineWarning message={crossError} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="underfundingPolicy">
          {(field: any) => (
            <Field>
              <FieldLabel className={LABEL_CLASS}>
                Underfunding Policy{" "}
                <span className="text-muted-foreground font-normal text-xs">
                  (optional)
                </span>
              </FieldLabel>
              <Select
                value={field.state.value || null}
                onValueChange={(val: any) => field.handleChange(val)}
              >
                <SelectTrigger className={selectClass(false)}>
                  <SelectValue placeholder="Select policy">
                    {getOptionLabel(UNDERFUNDING_POLICIES, field.state.value)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {UNDERFUNDING_POLICIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                What happens if the target amount isn't reached by the deadline.
              </FieldDescription>
            </Field>
          )}
        </form.Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form.Field name="startDate">
          {(field: any) => {
            const crossError = dateErrors.startError;
            return (
              <Field data-invalid={crossError ? "true" : undefined}>
                <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
                  Start Date{" "}
                  <span className="text-muted-foreground font-normal text-xs">
                    (optional)
                  </span>
                </FieldLabel>
                <Input
                  id={field.name}
                  type="date"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(e.target.value)
                  }
                  className={inputClass(!!crossError)}
                />
                <FieldDescription>When the project begins.</FieldDescription>
                <InlineWarning message={crossError} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="endDate">
          {(field: any) => {
            const crossError = dateErrors.endError;
            return (
              <Field data-invalid={crossError ? "true" : undefined}>
                <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
                  End Date{" "}
                  <span className="text-muted-foreground font-normal text-xs">
                    (optional)
                  </span>
                </FieldLabel>
                <Input
                  id={field.name}
                  type="date"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(e.target.value)
                  }
                  className={inputClass(!!crossError)}
                />
                <FieldDescription>Must be after start date.</FieldDescription>
                <InlineWarning message={crossError} />
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="exitDate">
          {(field: any) => {
            const crossError = dateErrors.exitError;
            return (
              <Field data-invalid={crossError ? "true" : undefined}>
                <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
                  Exit Date{" "}
                  <span className="text-muted-foreground font-normal text-xs">
                    (optional)
                  </span>
                </FieldLabel>
                <Input
                  id={field.name}
                  type="date"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(e.target.value)
                  }
                  className={inputClass(!!crossError)}
                />
                <FieldDescription>
                  When investors can expect to exit. Must be after end date.
                </FieldDescription>
                <InlineWarning message={crossError} />
              </Field>
            );
          }}
        </form.Field>
      </div>

      {/* Summary banner for date ordering */}
      {(dateErrors.endError ||
        dateErrors.exitError ||
        dateErrors.fundingError) && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">Date alignment issue</p>
            <p className="text-xs mt-0.5">
              Expected order: Funding Deadline → Start Date → End Date → Exit
              Date. Please adjust the dates above.
            </p>
          </div>
        </div>
      )}

      <form.Field name="riskLevel">
        {(field: any) => (
          <Field>
            <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
              Risk Level{" "}
              <span className="text-muted-foreground font-normal text-xs">
                (optional)
              </span>
            </FieldLabel>
            <Input
              id={field.name}
              placeholder="e.g. Low, Medium, High"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                field.handleChange(e.target.value)
              }
              className={inputClass(false)}
            />
            <FieldDescription>
              Risk assessment level shown to investors.
            </FieldDescription>
          </Field>
        )}
      </form.Field>

      <div className="space-y-4 rounded-lg border border-gray-200 p-4">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          Project Settings
        </p>

        <form.Field name="earlyExitAllowed">
          {(field: any) => (
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={field.state.value}
                onCheckedChange={(checked: boolean) =>
                  field.handleChange(checked)
                }
              />
              <div>
                <span className="text-sm font-medium text-foreground">
                  Allow early exit
                </span>
                <p className="text-xs text-muted-foreground">
                  Investors can withdraw before the project ends.
                </p>
              </div>
            </label>
          )}
        </form.Field>

        {earlyExitAllowed && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-7">
            <form.Field
              name="earlyExitPenaltyRate"
              validators={{
                onBlur: ({ value }: { value: string }) => {
                  if (value) return validatePenaltyRate(value) || undefined;
                  return undefined;
                },
                onChange: ({ value }: { value: string }) => {
                  if (value) return validatePenaltyRate(value) || undefined;
                  return undefined;
                },
              }}
            >
              {(field: any) => {
                const hasError =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={hasError ? "true" : undefined}>
                    <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
                      Penalty Rate (%){" "}
                      <span className="text-muted-foreground font-normal text-xs">
                        (optional)
                      </span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      placeholder="e.g. 5"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.handleChange(e.target.value)
                      }
                      className={inputClass(hasError)}
                    />
                    <FieldDescription>
                      Percentage fee charged for early exit (0–100).
                    </FieldDescription>
                    {hasError && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field
              name="earlyExitNoticeDays"
              validators={{
                onBlur: ({ value }: { value: number | undefined }) => {
                  if (value != null && value < 0) return "Must be 0 or greater";
                  return undefined;
                },
              }}
            >
              {(field: any) => {
                const hasError =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={hasError ? "true" : undefined}>
                    <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
                      Notice Period (days){" "}
                      <span className="text-muted-foreground font-normal text-xs">
                        (optional)
                      </span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      type="number"
                      min={0}
                      placeholder="e.g. 30"
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.handleChange(
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                      className={inputClass(hasError)}
                    />
                    <FieldDescription>
                      Days of advance notice required for withdrawal.
                    </FieldDescription>
                    {hasError && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </div>
        )}

        <form.Field name="secondaryMarketEnabled">
          {(field: any) => (
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={field.state.value}
                onCheckedChange={(checked: boolean) =>
                  field.handleChange(checked)
                }
              />
              <div>
                <span className="text-sm font-medium text-foreground">
                  Enable secondary market
                </span>
                <p className="text-xs text-muted-foreground">
                  Allow investors to trade their positions.
                </p>
              </div>
            </label>
          )}
        </form.Field>

        <form.Field name="isFeatured">
          {(field: any) => (
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={field.state.value}
                onCheckedChange={(checked: boolean) =>
                  field.handleChange(checked)
                }
              />
              <div>
                <span className="text-sm font-medium text-foreground">
                  Featured project
                </span>
                <p className="text-xs text-muted-foreground">
                  Highlight this project on the homepage.
                </p>
              </div>
            </label>
          )}
        </form.Field>
      </div>
    </div>
  );
};

export default InvestmentStep;
