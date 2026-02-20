"use client";

import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { orpc } from "@/utils/orpc";
import { MapPin } from "lucide-react";
import type { StepProps } from "./_types";
import { inputClass, selectClass, LABEL_CLASS, getOptionLabel } from "./_types";

const LocationStep = ({ form }: StepProps) => {
  const selectedState = useStore(
    form.store,
    (s: any) => s.values.state,
  ) as string;

  const statesQuery = useQuery(orpc.zones.getStates.queryOptions());

  const lgasQuery = useQuery({
    ...orpc.zones.getLGAs.queryOptions({
      input: { state: selectedState },
    }),
    enabled: !!selectedState,
  });

  const stateOptions = (statesQuery.data ?? []).map((s: string) => ({
    value: s,
    label: s,
  }));

  const lgaOptions = (lgasQuery.data ?? []).map((l: string) => ({
    value: l,
    label: l,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Project Location
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Where is the project located? All fields on this step are{" "}
          <span className="font-medium">optional</span>.
        </p>
      </div>

      <form.Field name="address">
        {(field: any) => (
          <Field>
            <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
              Address{" "}
              <span className="text-muted-foreground font-normal text-xs">
                (optional)
              </span>
            </FieldLabel>
            <Input
              id={field.name}
              placeholder="Street address"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                field.handleChange(e.target.value)
              }
              className={inputClass(false)}
            />
          </Field>
        )}
      </form.Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form.Field name="state">
          {(field: any) => (
            <Field>
              <FieldLabel className={LABEL_CLASS}>
                State{" "}
                <span className="text-muted-foreground font-normal text-xs">
                  (optional)
                </span>
              </FieldLabel>
              <Select
                value={field.state.value || null}
                onValueChange={(val: any) => {
                  field.handleChange(val);
                  form.setFieldValue("city", "");
                }}
              >
                <SelectTrigger className={selectClass(false)}>
                  <SelectValue placeholder="Select state">
                    {getOptionLabel(stateOptions, field.state.value)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {stateOptions.map((s: { value: string; label: string }) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        </form.Field>

        <form.Field name="city">
          {(field: any) => (
            <Field>
              <FieldLabel className={LABEL_CLASS}>
                Local Government{" "}
                <span className="text-muted-foreground font-normal text-xs">
                  (optional)
                </span>
              </FieldLabel>
              <Select
                value={field.state.value || null}
                onValueChange={(val: any) => field.handleChange(val)}
                disabled={!selectedState || lgasQuery.isLoading}
              >
                <SelectTrigger className={selectClass(false)}>
                  <SelectValue
                    placeholder={
                      !selectedState
                        ? "Select a state first"
                        : lgasQuery.isLoading
                          ? "Loading..."
                          : "Select LGA"
                    }
                  >
                    {getOptionLabel(lgaOptions, field.state.value)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {lgaOptions.map((l: { value: string; label: string }) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!selectedState && (
                <FieldDescription>
                  Select a state first to see available LGAs.
                </FieldDescription>
              )}
            </Field>
          )}
        </form.Field>
      </div>

      <form.Field name="country">
        {(field: any) => (
          <Field>
            <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
              Country
            </FieldLabel>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
              </div>
              <Input
                id={field.name}
                value={field.state.value}
                disabled
                className={`${inputClass(false)} pl-10 bg-muted/50 cursor-not-allowed`}
              />
            </div>
            <FieldDescription>
              Currently only Nigeria is supported.
            </FieldDescription>
          </Field>
        )}
      </form.Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form.Field name="latitude">
          {(field: any) => (
            <Field>
              <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
                Latitude{" "}
                <span className="text-muted-foreground font-normal text-xs">
                  (optional)
                </span>
              </FieldLabel>
              <Input
                id={field.name}
                placeholder="e.g. 6.4541"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.handleChange(e.target.value)
                }
                className={inputClass(false)}
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="longitude">
          {(field: any) => (
            <Field>
              <FieldLabel htmlFor={field.name} className={LABEL_CLASS}>
                Longitude{" "}
                <span className="text-muted-foreground font-normal text-xs">
                  (optional)
                </span>
              </FieldLabel>
              <Input
                id={field.name}
                placeholder="e.g. 7.5013"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  field.handleChange(e.target.value)
                }
                className={inputClass(false)}
              />
            </Field>
          )}
        </form.Field>
      </div>
    </div>
  );
};

export default LocationStep;
