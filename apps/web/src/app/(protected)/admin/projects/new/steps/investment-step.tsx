"use client";

import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useStore } from "@tanstack/react-store";
import type { StepProps } from "./_types";
import { INPUT_CLASS, SELECT_CLASS, LABEL_CLASS, getOptionLabel } from "./_types";

const UNDERFUNDING_POLICIES = [
  { value: "REFUND_ALL", label: "Refund All" },
  { value: "PARTIAL_PROCEED", label: "Partial Proceed" },
  { value: "EXTEND_DEADLINE", label: "Extend Deadline" },
];

const InvestmentStep = ({ form }: StepProps) => {
  const earlyExitAllowed = useStore(form.store, (s: any) => s.values.earlyExitAllowed);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Investment & Timeline
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Financial details, dates, and project settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form.Field name="targetAmount">
          {(field: any) => (
            <Field
              data-invalid={
                field.state.meta.errors.length > 0 ? "true" : undefined
              }
            >
              <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
                Target Amount *
              </FieldLabel>
              <Input
                id={field.name}
                placeholder="e.g. 50000000"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.handleChange(e.target.value)
                }
                className={INPUT_CLASS}
              />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>

        <form.Field name="currency">
          {(field: any) => (
            <Field>
              <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
                Currency
              </FieldLabel>
              <Input
                id={field.name}
                placeholder="NGN"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.handleChange(e.target.value)
                }
                className={INPUT_CLASS}
              />
            </Field>
          )}
        </form.Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form.Field name="minInvestment">
          {(field: any) => (
            <Field>
              <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
                Minimum Investment
              </FieldLabel>
              <Input
                id={field.name}
                placeholder="e.g. 100000"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.handleChange(e.target.value)
                }
                className={INPUT_CLASS}
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="maxInvestment">
          {(field: any) => (
            <Field>
              <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
                Maximum Investment
              </FieldLabel>
              <Input
                id={field.name}
                placeholder="e.g. 10000000"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.handleChange(e.target.value)
                }
                className={INPUT_CLASS}
              />
            </Field>
          )}
        </form.Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form.Field name="fundingDeadline">
          {(field: any) => (
            <Field>
              <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
                Funding Deadline
              </FieldLabel>
              <Input
                id={field.name}
                type="date"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.handleChange(e.target.value)
                }
                className={INPUT_CLASS}
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="underfundingPolicy">
          {(field: any) => (
            <Field>
              <FieldLabel className={LABEL_CLASS}>
                Underfunding Policy
              </FieldLabel>
              <Select
                value={field.state.value || null}
                onValueChange={(val: any) => field.handleChange(val)}
              >
                <SelectTrigger className={SELECT_CLASS}>
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
            </Field>
          )}
        </form.Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form.Field name="startDate">
          {(field: any) => (
            <Field>
              <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
                Start Date
              </FieldLabel>
              <Input
                id={field.name}
                type="date"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.handleChange(e.target.value)
                }
                className={INPUT_CLASS}
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="endDate">
          {(field: any) => (
            <Field>
              <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
                End Date
              </FieldLabel>
              <Input
                id={field.name}
                type="date"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.handleChange(e.target.value)
                }
                className={INPUT_CLASS}
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="exitDate">
          {(field: any) => (
            <Field>
              <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
                Exit Date
              </FieldLabel>
              <Input
                id={field.name}
                type="date"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.handleChange(e.target.value)
                }
                className={INPUT_CLASS}
              />
            </Field>
          )}
        </form.Field>
      </div>

      <form.Field name="riskLevel">
        {(field: any) => (
          <Field>
            <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
              Risk Level
            </FieldLabel>
            <Input
              id={field.name}
              placeholder="e.g. Low, Medium, High"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                field.handleChange(e.target.value)
              }
              className={INPUT_CLASS}
            />
          </Field>
        )}
      </form.Field>

      <div className="space-y-4 rounded-lg border border-gray-200 p-4">
        <form.Field name="earlyExitAllowed">
          {(field: any) => (
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={field.state.value}
                onCheckedChange={(checked: boolean) =>
                  field.handleChange(checked)
                }
              />
              <span className="text-sm font-medium text-foreground">
                Allow early exit
              </span>
            </label>
          )}
        </form.Field>

        {earlyExitAllowed && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-7">
            <form.Field name="earlyExitPenaltyRate">
              {(field: any) => (
                <Field>
                  <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
                    Penalty Rate (%)
                  </FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="e.g. 5"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      field.handleChange(e.target.value)
                    }
                    className={INPUT_CLASS}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="earlyExitNoticeDays">
              {(field: any) => (
                <Field>
                  <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
                    Notice Period (days)
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    placeholder="e.g. 30"
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      field.handleChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    className={INPUT_CLASS}
                  />
                </Field>
              )}
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
              <span className="text-sm font-medium text-foreground">
                Enable secondary market
              </span>
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
              <span className="text-sm font-medium text-foreground">
                Featured project
              </span>
            </label>
          )}
        </form.Field>
      </div>
    </div>
  );
};

export default InvestmentStep;
