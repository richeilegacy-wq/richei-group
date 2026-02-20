"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { StepProps } from "./_types";
import {
  inputClass,
  selectClass,
  LABEL_CLASS,
  getOptionLabel,
  validateSlug,
} from "./_types";

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
          Basic information about the project.{" "}
          <span className="text-destructive">*</span> marks required fields.
        </p>
      </div>

      <form.Field
        name="name"
        validators={{
          onBlur: ({ value }: { value: string }) => {
            if (!value || !value.trim()) return "Project name is required";
            if (value.length < 3) return "Name must be at least 3 characters";
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
                Project Name <span className="text-destructive">*</span>
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
                className={inputClass(hasError)}
              />
              {hasError && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <form.Field
        name="slug"
        validators={{
          onBlur: ({ value }: { value: string }) => {
            if (!value || !value.trim()) return "Slug is required";
            const err = validateSlug(value);
            if (err) return err;
            return undefined;
          },
          onChange: ({ value }: { value: string }) => {
            if (value && validateSlug(value)) {
              return validateSlug(value);
            }
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
                URL Slug <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id={field.name}
                placeholder="enugu-residential-estate-phase-1"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.handleChange(e.target.value)
                }
                className={inputClass(hasError)}
              />
              <FieldDescription>
                Used in the project URL. Only lowercase letters, numbers, and
                hyphens.
              </FieldDescription>
              {hasError && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form.Field
          name="type"
          validators={{
            onBlur: ({ value }: { value: string }) => {
              if (!value) return "Project type is required";
              return undefined;
            },
          }}
        >
          {(field: any) => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <Field data-invalid={hasError ? "true" : undefined}>
                <FieldLabel className={LABEL_CLASS}>
                  Project Type <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  value={field.state.value || null}
                  onValueChange={(val: any) => field.handleChange(val)}
                >
                  <SelectTrigger className={selectClass(hasError)}>
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
                {hasError && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="ownershipType">
          {(field: any) => (
            <Field>
              <FieldLabel className={LABEL_CLASS}>
                Ownership Type{" "}
                <span className="text-muted-foreground font-normal text-xs">
                  (optional)
                </span>
              </FieldLabel>
              <Select
                value={field.state.value || null}
                onValueChange={(val: any) => field.handleChange(val)}
              >
                <SelectTrigger className={selectClass(false)}>
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
              <FieldDescription>
                How investors will own their share of the project.
              </FieldDescription>
            </Field>
          )}
        </form.Field>
      </div>

      <form.Field name="summary">
        {(field: any) => (
          <Field>
            <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
              Summary{" "}
              <span className="text-muted-foreground font-normal text-xs">
                (optional)
              </span>
            </FieldLabel>
            <Input
              id={field.name}
              placeholder="A brief one-line summary of the project"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                field.handleChange(e.target.value)
              }
              className={inputClass(false)}
            />
            <FieldDescription>
              A short tagline shown in project cards and listings.
            </FieldDescription>
          </Field>
        )}
      </form.Field>

      <form.Field name="description">
        {(field: any) => (
          <Field>
            <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
              Description{" "}
              <span className="text-muted-foreground font-normal text-xs">
                (optional)
              </span>
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
            <FieldDescription>
              Detailed project overview visible on the project page.
            </FieldDescription>
          </Field>
        )}
      </form.Field>
    </div>
  );
};

export default OverviewStep;
