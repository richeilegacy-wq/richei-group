"use client";

import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
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
import { INPUT_CLASS, SELECT_CLASS, LABEL_CLASS, getOptionLabel } from "./_types";

const REVENUE_TYPES = [
  { value: "RESALE", label: "Resale" },
  { value: "LEASE", label: "Lease" },
  { value: "FARMING", label: "Farming" },
  { value: "RENTAL", label: "Rental" },
  { value: "APPRECIATION", label: "Appreciation" },
  { value: "OTHER", label: "Other" },
];

const RETURN_TYPES = [
  { value: "FIXED_PERCENTAGE", label: "Fixed Percentage" },
  { value: "PROFIT_SHARE", label: "Profit Share" },
  { value: "APPRECIATION", label: "Appreciation" },
  { value: "PERIODIC_RENTAL", label: "Periodic Rental" },
];

const PAYOUT_FREQUENCIES = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "BIANNUALLY", label: "Biannually" },
  { value: "YEARLY", label: "Yearly" },
  { value: "AT_EXIT", label: "At Exit" },
  { value: "ON_SALE", label: "On Sale" },
];

const FEE_TYPES = [
  { value: "UPFRONT", label: "Upfront" },
  { value: "ON_PROFIT", label: "On Profit" },
  { value: "ON_WITHDRAWAL", label: "On Withdrawal" },
  { value: "MANAGEMENT", label: "Management" },
];

const RevenueStep = ({ form }: StepProps) => {
  const revenueStreams = useStore(form.store, (s: any) => s.values.revenueStreams) as any[];
  const returnStructures = useStore(form.store, (s: any) => s.values.returnStructures) as any[];
  const fees = useStore(form.store, (s: any) => s.values.fees) as any[];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Revenue, Returns & Fees
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          How investors make money and what fees apply
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Revenue Streams
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-lg gap-1.5"
            onClick={() =>
              form.pushFieldValue("revenueStreams", {
                type: "",
                description: "",
                expectedReturnRate: "",
                isActive: true,
              })
            }
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </Button>
        </div>

        {revenueStreams.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg">
            No revenue streams added yet
          </p>
        )}

        {revenueStreams.map((_: any, index: number) => (
          <div
            key={index}
            className="border rounded-lg p-4 space-y-4 relative"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"
              onClick={() => form.removeFieldValue("revenueStreams", index)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
              <form.Field name={`revenueStreams[${index}].type`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>Type</FieldLabel>
                    <Select
                      value={field.state.value || null}
                      onValueChange={(val: any) => field.handleChange(val)}
                    >
                      <SelectTrigger className={SELECT_CLASS}>
                        <SelectValue placeholder="Select type">
                          {getOptionLabel(REVENUE_TYPES, field.state.value)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {REVENUE_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>

              <form.Field name={`revenueStreams[${index}].expectedReturnRate`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>
                      Expected Return Rate
                    </FieldLabel>
                    <Input
                      placeholder="e.g. 25"
                      value={field.state.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.handleChange(e.target.value)
                      }
                      className={INPUT_CLASS}
                    />
                  </Field>
                )}
              </form.Field>
            </div>

            <form.Field name={`revenueStreams[${index}].description`}>
              {(field: any) => (
                <Field>
                  <FieldLabel className={LABEL_CLASS}>Description</FieldLabel>
                  <Input
                    placeholder="Describe this revenue stream"
                    value={field.state.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      field.handleChange(e.target.value)
                    }
                    className={INPUT_CLASS}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name={`revenueStreams[${index}].isActive`}>
              {(field: any) => (
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={field.state.value}
                    onCheckedChange={(checked: boolean) =>
                      field.handleChange(checked)
                    }
                  />
                  <span className="text-sm text-foreground">Active</span>
                </label>
              )}
            </form.Field>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Return Structures
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-lg gap-1.5"
            onClick={() =>
              form.pushFieldValue("returnStructures", {
                type: "",
                rate: "",
                payoutFrequency: "",
                description: "",
                isActive: true,
              })
            }
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </Button>
        </div>

        {returnStructures.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg">
            No return structures added yet
          </p>
        )}

        {returnStructures.map((_: any, index: number) => (
          <div
            key={index}
            className="border rounded-lg p-4 space-y-4 relative"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"
              onClick={() => form.removeFieldValue("returnStructures", index)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
              <form.Field name={`returnStructures[${index}].type`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>Type</FieldLabel>
                    <Select
                      value={field.state.value || null}
                      onValueChange={(val: any) => field.handleChange(val)}
                    >
                      <SelectTrigger className={SELECT_CLASS}>
                        <SelectValue placeholder="Select type">
                          {getOptionLabel(RETURN_TYPES, field.state.value)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {RETURN_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>

              <form.Field name={`returnStructures[${index}].rate`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>Rate (%)</FieldLabel>
                    <Input
                      placeholder="e.g. 15"
                      value={field.state.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.handleChange(e.target.value)
                      }
                      className={INPUT_CLASS}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name={`returnStructures[${index}].payoutFrequency`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>
                      Payout Frequency
                    </FieldLabel>
                    <Select
                      value={field.state.value || null}
                      onValueChange={(val: any) => field.handleChange(val)}
                    >
                      <SelectTrigger className={SELECT_CLASS}>
                        <SelectValue placeholder="Select frequency">
                          {getOptionLabel(PAYOUT_FREQUENCIES, field.state.value)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {PAYOUT_FREQUENCIES.map((f) => (
                          <SelectItem key={f.value} value={f.value}>
                            {f.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>
            </div>

            <form.Field name={`returnStructures[${index}].description`}>
              {(field: any) => (
                <Field>
                  <FieldLabel className={LABEL_CLASS}>Description</FieldLabel>
                  <Input
                    placeholder="Describe this return structure"
                    value={field.state.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      field.handleChange(e.target.value)
                    }
                    className={INPUT_CLASS}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name={`returnStructures[${index}].isActive`}>
              {(field: any) => (
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={field.state.value}
                    onCheckedChange={(checked: boolean) =>
                      field.handleChange(checked)
                    }
                  />
                  <span className="text-sm text-foreground">Active</span>
                </label>
              )}
            </form.Field>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Platform Fees
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-lg gap-1.5"
            onClick={() =>
              form.pushFieldValue("fees", {
                type: "",
                rate: "",
                fixedAmount: "",
                description: "",
              })
            }
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </Button>
        </div>

        {fees.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg">
            No fees added yet
          </p>
        )}

        {fees.map((_: any, index: number) => (
          <div
            key={index}
            className="border rounded-lg p-4 space-y-4 relative"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"
              onClick={() => form.removeFieldValue("fees", index)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
              <form.Field name={`fees[${index}].type`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>Type</FieldLabel>
                    <Select
                      value={field.state.value || null}
                      onValueChange={(val: any) => field.handleChange(val)}
                    >
                      <SelectTrigger className={SELECT_CLASS}>
                        <SelectValue placeholder="Select fee type">
                          {getOptionLabel(FEE_TYPES, field.state.value)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {FEE_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>

              <form.Field name={`fees[${index}].rate`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>Rate (%)</FieldLabel>
                    <Input
                      placeholder="e.g. 5"
                      value={field.state.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.handleChange(e.target.value)
                      }
                      className={INPUT_CLASS}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name={`fees[${index}].fixedAmount`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>
                      Fixed Amount
                    </FieldLabel>
                    <Input
                      placeholder="e.g. 10000"
                      value={field.state.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.handleChange(e.target.value)
                      }
                      className={INPUT_CLASS}
                    />
                  </Field>
                )}
              </form.Field>
            </div>

            <form.Field name={`fees[${index}].description`}>
              {(field: any) => (
                <Field>
                  <FieldLabel className={LABEL_CLASS}>Description</FieldLabel>
                  <Input
                    placeholder="Describe this fee"
                    value={field.state.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      field.handleChange(e.target.value)
                    }
                    className={INPUT_CLASS}
                  />
                </Field>
              )}
            </form.Field>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueStep;
