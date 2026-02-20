"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { StepProps } from "./_types";
import { INPUT_CLASS, SELECT_CLASS, LABEL_CLASS, getOptionLabel } from "./_types";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const PROJECT_TYPES = [
  { value: "ESTATE", label: "Estate" },
  { value: "LAND", label: "Land" },
  { value: "PROPERTY", label: "Property" },
  { value: "BUILDING", label: "Building" },
  { value: "FARM", label: "Farm" },
  { value: "OTHER", label: "Other" },
];

const OWNERSHIP_TYPES = [
  { value: "LEGAL_TITLE", label: "Legal Title" },
  { value: "PROFIT_PARTICIPATION", label: "Profit Participation" },
];

const OverviewStep = ({ form }: StepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Project Overview
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Basic information about the project
        </p>
      </div>

      <form.Field name="name">
        {(field: any) => (
          <Field
            data-invalid={
              field.state.meta.errors.length > 0 ? "true" : undefined
            }
          >
            <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
              Project Name *
            </FieldLabel>
            <Input
              id={field.name}
              placeholder="e.g. Enugu Residential Estate Phase 1"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const oldAutoSlug = generateSlug(field.state.value);
                field.handleChange(e.target.value);
                const currentSlug = form.state.values.slug;
                if (!currentSlug || currentSlug === oldAutoSlug) {
                  form.setFieldValue("slug", generateSlug(e.target.value));
                }
              }}
              className={INPUT_CLASS}
            />
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>

      <form.Field name="slug">
        {(field: any) => (
          <Field
            data-invalid={
              field.state.meta.errors.length > 0 ? "true" : undefined
            }
          >
            <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
              URL Slug *
            </FieldLabel>
            <Input
              id={field.name}
              placeholder="enugu-residential-estate-phase-1"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form.Field name="type">
          {(field: any) => (
            <Field
              data-invalid={
                field.state.meta.errors.length > 0 ? "true" : undefined
              }
            >
              <FieldLabel className={LABEL_CLASS}>Project Type *</FieldLabel>
              <Select
                value={field.state.value || null}
                onValueChange={(val: any) => field.handleChange(val)}
              >
                <SelectTrigger className={SELECT_CLASS}>
                  <SelectValue placeholder="Select project type">
                    {getOptionLabel(PROJECT_TYPES, field.state.value)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>

        <form.Field name="ownershipType">
          {(field: any) => (
            <Field>
              <FieldLabel className={LABEL_CLASS}>Ownership Type</FieldLabel>
              <Select
                value={field.state.value || null}
                onValueChange={(val: any) => field.handleChange(val)}
              >
                <SelectTrigger className={SELECT_CLASS}>
                  <SelectValue placeholder="Select ownership type">
                    {getOptionLabel(OWNERSHIP_TYPES, field.state.value)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {OWNERSHIP_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        </form.Field>
      </div>

      <form.Field name="summary">
        {(field: any) => (
          <Field>
            <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
              Summary
            </FieldLabel>
            <Input
              id={field.name}
              placeholder="A brief one-line summary of the project"
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

      <form.Field name="description">
        {(field: any) => (
          <Field>
            <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
              Description
            </FieldLabel>
            <Textarea
              id={field.name}
              placeholder="Detailed description of the project, goals, and expected outcomes..."
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                field.handleChange(e.target.value)
              }
              className="rounded-lg border-gray-200 text-sm min-h-32 focus-visible:border-primary focus-visible:ring-primary/20"
            />
          </Field>
        )}
      </form.Field>
    </div>
  );
};

export default OverviewStep;
