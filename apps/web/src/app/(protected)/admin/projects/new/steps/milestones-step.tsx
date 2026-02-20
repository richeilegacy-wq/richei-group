"use client";

import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useStore } from "@tanstack/react-store";
import type { StepProps } from "./_types";
import { inputClass, selectClass, LABEL_CLASS, getOptionLabel } from "./_types";

const MILESTONE_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "DELAYED", label: "Delayed" },
];

const TOKEN_TYPES = [
  { value: "PARTICIPATION", label: "Participation" },
  { value: "OWNERSHIP", label: "Ownership" },
  { value: "REWARD", label: "Reward" },
];

const MilestonesStep = ({ form }: StepProps) => {
  const milestones = useStore(
    form.store,
    (s: any) => s.values.milestones,
  ) as any[];
  const tokens = useStore(form.store, (s: any) => s.values.tokens) as any[];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Milestones & Tokens
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Project timeline milestones and token configuration. All sections are{" "}
          <span className="font-medium">optional</span>.{" "}
          <span className="text-destructive">*</span> marks required fields
          within each item.
        </p>
      </div>

      {/* ---- Milestones ---- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Milestones
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Key phases or steps in the project timeline.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-lg gap-1.5"
            onClick={() =>
              form.pushFieldValue("milestones", {
                name: "",
                description: "",
                status: "PENDING",
                targetDate: "",
                sortOrder: milestones.length,
              })
            }
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </Button>
        </div>

        {milestones.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg">
            No milestones added yet
          </p>
        )}

        {milestones.map((_: any, index: number) => (
          <div key={index} className="border rounded-lg p-4 space-y-4 relative">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"
              onClick={() => form.removeFieldValue("milestones", index)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
              <form.Field name={`milestones[${index}].name`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>
                      Name <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      placeholder="e.g. Site Clearing"
                      value={field.state.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.handleChange(e.target.value)
                      }
                      className={inputClass(false)}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name={`milestones[${index}].status`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>
                      Status{" "}
                      <span className="text-muted-foreground font-normal text-xs">
                        (optional)
                      </span>
                    </FieldLabel>
                    <Select
                      value={field.state.value || null}
                      onValueChange={(val: any) => field.handleChange(val)}
                    >
                      <SelectTrigger className={selectClass(false)}>
                        <SelectValue placeholder="Select status">
                          {getOptionLabel(
                            MILESTONE_STATUSES,
                            field.state.value,
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {MILESTONE_STATUSES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field name={`milestones[${index}].targetDate`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>
                      Target Date{" "}
                      <span className="text-muted-foreground font-normal text-xs">
                        (optional)
                      </span>
                    </FieldLabel>
                    <Input
                      type="date"
                      value={field.state.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.handleChange(e.target.value)
                      }
                      className={inputClass(false)}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name={`milestones[${index}].sortOrder`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>
                      Sort Order{" "}
                      <span className="text-muted-foreground font-normal text-xs">
                        (optional)
                      </span>
                    </FieldLabel>
                    <Input
                      type="number"
                      placeholder="0"
                      value={field.state.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.handleChange(Number(e.target.value))
                      }
                      className={inputClass(false)}
                    />
                    <FieldDescription>
                      Controls display order. Lower numbers appear first.
                    </FieldDescription>
                  </Field>
                )}
              </form.Field>
            </div>

            <form.Field name={`milestones[${index}].description`}>
              {(field: any) => (
                <Field>
                  <FieldLabel className={LABEL_CLASS}>
                    Description{" "}
                    <span className="text-muted-foreground font-normal text-xs">
                      (optional)
                    </span>
                  </FieldLabel>
                  <Input
                    placeholder="Describe this milestone"
                    value={field.state.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      field.handleChange(e.target.value)
                    }
                    className={inputClass(false)}
                  />
                </Field>
              )}
            </form.Field>
          </div>
        ))}
      </div>

      {/* ---- Tokens ---- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Tokens</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Define investment tokens for this project.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-lg gap-1.5"
            onClick={() =>
              form.pushFieldValue("tokens", {
                tokenType: "",
                name: "",
                totalSupply: "",
                availableSupply: "",
                pricePerToken: "",
                currency: "NGN",
                isTradeable: false,
              })
            }
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </Button>
        </div>

        {tokens.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg">
            No tokens configured yet
          </p>
        )}

        {tokens.map((_: any, index: number) => (
          <div key={index} className="border rounded-lg p-4 space-y-4 relative">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"
              onClick={() => form.removeFieldValue("tokens", index)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
              <form.Field name={`tokens[${index}].tokenType`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>
                      Token Type <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                      value={field.state.value || null}
                      onValueChange={(val: any) => field.handleChange(val)}
                    >
                      <SelectTrigger className={selectClass(false)}>
                        <SelectValue placeholder="Select token type">
                          {getOptionLabel(TOKEN_TYPES, field.state.value)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {TOKEN_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>

              <form.Field name={`tokens[${index}].name`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>
                      Token Name <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      placeholder="e.g. RHG-ENUGU-01"
                      value={field.state.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.handleChange(e.target.value)
                      }
                      className={inputClass(false)}
                    />
                  </Field>
                )}
              </form.Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <form.Field name={`tokens[${index}].totalSupply`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>
                      Total Supply <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      placeholder="e.g. 100000"
                      value={field.state.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.handleChange(e.target.value)
                      }
                      className={inputClass(false)}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name={`tokens[${index}].availableSupply`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>
                      Available Supply{" "}
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      placeholder="e.g. 100000"
                      value={field.state.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.handleChange(e.target.value)
                      }
                      className={inputClass(false)}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name={`tokens[${index}].pricePerToken`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>
                      Price per Token{" "}
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      placeholder="e.g. 500"
                      value={field.state.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.handleChange(e.target.value)
                      }
                      className={inputClass(false)}
                    />
                  </Field>
                )}
              </form.Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field name={`tokens[${index}].currency`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>
                      Currency{" "}
                      <span className="text-muted-foreground font-normal text-xs">
                        (optional)
                      </span>
                    </FieldLabel>
                    <Input
                      placeholder="NGN"
                      value={field.state.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.handleChange(e.target.value)
                      }
                      className={inputClass(false)}
                    />
                    <FieldDescription>Defaults to NGN.</FieldDescription>
                  </Field>
                )}
              </form.Field>

              <form.Field name={`tokens[${index}].isTradeable`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>&nbsp;</FieldLabel>
                    <label className="flex items-center gap-3 cursor-pointer h-12">
                      <Checkbox
                        checked={field.state.value}
                        onCheckedChange={(checked: boolean) =>
                          field.handleChange(checked)
                        }
                      />
                      <div>
                        <span className="text-sm text-foreground">
                          Tradeable
                        </span>
                        <p className="text-xs text-muted-foreground">
                          Can be traded on secondary market.
                        </p>
                      </div>
                    </label>
                  </Field>
                )}
              </form.Field>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilestonesStep;
