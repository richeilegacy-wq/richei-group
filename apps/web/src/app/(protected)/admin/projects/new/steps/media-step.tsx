"use client";

import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
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
import { Plus, Trash2, Upload, Loader2, ImageIcon, Film } from "lucide-react";
import { orpc } from "@/utils/orpc";
import { toast } from "sonner";
import { useStore } from "@tanstack/react-store";
import type { StepProps } from "./_types";
import { INPUT_CLASS, SELECT_CLASS, LABEL_CLASS, getOptionLabel } from "./_types";

const MEDIA_TYPES = [
  { value: "IMAGE", label: "Image" },
  { value: "VIDEO", label: "Video" },
  { value: "MAP", label: "Map" },
  { value: "FLOOR_PLAN", label: "Floor Plan" },
];

const DOCUMENT_TYPES = [
  { value: "SURVEY_PLAN", label: "Survey Plan" },
  { value: "ALLOCATION_LETTER", label: "Allocation Letter" },
  { value: "DEED", label: "Deed" },
  { value: "CONTRACT", label: "Contract" },
  { value: "TITLE_CERTIFICATE", label: "Title Certificate" },
  { value: "OTHER", label: "Other" },
];

function getUploadType(file: File): "IMAGE" | "VIDEO" | "DOCUMENT" {
  if (file.type.startsWith("image/")) return "IMAGE";
  if (file.type.startsWith("video/")) return "VIDEO";
  return "DOCUMENT";
}

function MediaPreview({ url, type }: { url: string; type: string }) {
  if (!url) return null;

  const isVideo = type === "VIDEO";

  if (isVideo) {
    return (
      <div className="relative rounded-lg overflow-hidden bg-muted/30 border">
        <video
          src={url}
          controls
          className="w-full max-h-48 object-contain"
          preload="metadata"
        />
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden bg-muted/30 border">
      <img
        src={url}
        alt="Preview"
        className="w-full max-h-48 object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
          (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
        }}
      />
      <div className="hidden flex-col items-center justify-center py-8 text-muted-foreground">
        <ImageIcon className="w-8 h-8 mb-1" />
        <span className="text-xs">Preview unavailable</span>
      </div>
    </div>
  );
}

const MediaStep = ({ form }: StepProps) => {
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const mediaItems = useStore(form.store, (s: any) => s.values.media) as any[];
  const documents = useStore(form.store, (s: any) => s.values.documents) as any[];

  const uploadMutation = useMutation(
    orpc.project.uploadFile.mutationOptions({
      onError: (error: any) => {
        toast.error(error.message || "Upload failed");
      },
    }),
  );

  const handleMediaUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files?.length) return;

    for (const file of Array.from(files)) {
      try {
        const url = await uploadMutation.mutateAsync({
          file,
          type: getUploadType(file),
          folder: "projects/media",
        });
        form.pushFieldValue("media", {
          type: file.type.startsWith("video/") ? "VIDEO" : "IMAGE",
          url: url as string,
          altText: "",
          sortOrder: mediaItems.length,
          isCover: false,
        });
      } catch {
        // handled by mutation onError
      }
    }

    if (mediaInputRef.current) mediaInputRef.current.value = "";
  };

  const handleDocUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files?.length) return;

    for (const file of Array.from(files)) {
      try {
        const url = await uploadMutation.mutateAsync({
          file,
          type: "DOCUMENT",
          folder: "projects/documents",
        });
        form.pushFieldValue("documents", {
          type: "OTHER",
          name: file.name.replace(/\.[^.]+$/, ""),
          url: url as string,
          mimeType: file.type,
          signedBy: "",
          verifiedBy: "",
          isPublic: false,
        });
      } catch {
        // handled by mutation onError
      }
    }

    if (docInputRef.current) docInputRef.current.value = "";
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Media & Documents
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Upload images, videos, maps, and project documents
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Media</h3>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-lg gap-1.5"
              disabled={uploadMutation.isPending}
              onClick={() => mediaInputRef.current?.click()}
            >
              {uploadMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              Upload
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-lg gap-1.5"
              onClick={() =>
                form.pushFieldValue("media", {
                  type: "IMAGE",
                  url: "",
                  altText: "",
                  sortOrder: mediaItems.length,
                  isCover: false,
                })
              }
            >
              <Plus className="w-3.5 h-3.5" />
              Add URL
            </Button>
          </div>
          <input
            ref={mediaInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleMediaUpload}
          />
        </div>

        {mediaItems.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg">
            No media added yet
          </p>
        )}

        {mediaItems.map((_: any, index: number) => (
          <div
            key={index}
            className="border rounded-lg p-4 space-y-4 relative"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"
              onClick={() => form.removeFieldValue("media", index)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
              <form.Field name={`media[${index}].type`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>Type</FieldLabel>
                    <Select
                      value={field.state.value || null}
                      onValueChange={(val: any) => field.handleChange(val)}
                    >
                      <SelectTrigger className={SELECT_CLASS}>
                        <SelectValue placeholder="Select media type">
                          {getOptionLabel(MEDIA_TYPES, field.state.value)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {MEDIA_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>

              <form.Field name={`media[${index}].url`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>URL *</FieldLabel>
                    <Input
                      placeholder="https://..."
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

            <form.Field name={`media[${index}].url`}>
              {(urlField: any) => (
                <form.Field name={`media[${index}].type`}>
                  {(typeField: any) => (
                    <MediaPreview url={urlField.state.value} type={typeField.state.value} />
                  )}
                </form.Field>
              )}
            </form.Field>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <form.Field name={`media[${index}].altText`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>Alt Text</FieldLabel>
                    <Input
                      placeholder="Describe the media"
                      value={field.state.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.handleChange(e.target.value)
                      }
                      className={INPUT_CLASS}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name={`media[${index}].sortOrder`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>
                      Sort Order
                    </FieldLabel>
                    <Input
                      type="number"
                      value={field.state.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.handleChange(Number(e.target.value))
                      }
                      className={INPUT_CLASS}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name={`media[${index}].isCover`}>
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
                      <span className="text-sm text-foreground">
                        Cover Image
                      </span>
                    </label>
                  </Field>
                )}
              </form.Field>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Documents</h3>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-lg gap-1.5"
              disabled={uploadMutation.isPending}
              onClick={() => docInputRef.current?.click()}
            >
              {uploadMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              Upload
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-lg gap-1.5"
              onClick={() =>
                form.pushFieldValue("documents", {
                  type: "OTHER",
                  name: "",
                  url: "",
                  mimeType: "",
                  signedBy: "",
                  verifiedBy: "",
                  isPublic: false,
                })
              }
            >
              <Plus className="w-3.5 h-3.5" />
              Add URL
            </Button>
          </div>
          <input
            ref={docInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            multiple
            className="hidden"
            onChange={handleDocUpload}
          />
        </div>

        {documents.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg">
            No documents added yet
          </p>
        )}

        {documents.map((_: any, index: number) => (
          <div
            key={index}
            className="border rounded-lg p-4 space-y-4 relative"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"
              onClick={() => form.removeFieldValue("documents", index)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
              <form.Field name={`documents[${index}].type`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>
                      Document Type
                    </FieldLabel>
                    <Select
                      value={field.state.value || null}
                      onValueChange={(val: any) => field.handleChange(val)}
                    >
                      <SelectTrigger className={SELECT_CLASS}>
                        <SelectValue placeholder="Select document type">
                          {getOptionLabel(DOCUMENT_TYPES, field.state.value)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {DOCUMENT_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>

              <form.Field name={`documents[${index}].name`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>Name *</FieldLabel>
                    <Input
                      placeholder="Document name"
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

            <form.Field name={`documents[${index}].url`}>
              {(field: any) => (
                <Field>
                  <FieldLabel className={LABEL_CLASS}>URL *</FieldLabel>
                  <Input
                    placeholder="https://..."
                    value={field.state.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      field.handleChange(e.target.value)
                    }
                    className={INPUT_CLASS}
                  />
                </Field>
              )}
            </form.Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field name={`documents[${index}].signedBy`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>Signed By</FieldLabel>
                    <Input
                      placeholder="Name of signer"
                      value={field.state.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        field.handleChange(e.target.value)
                      }
                      className={INPUT_CLASS}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name={`documents[${index}].verifiedBy`}>
                {(field: any) => (
                  <Field>
                    <FieldLabel className={LABEL_CLASS}>
                      Verified By
                    </FieldLabel>
                    <Input
                      placeholder="Name of verifier"
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

            <form.Field name={`documents[${index}].isPublic`}>
              {(field: any) => (
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={field.state.value}
                    onCheckedChange={(checked: boolean) =>
                      field.handleChange(checked)
                    }
                  />
                  <span className="text-sm text-foreground">
                    Publicly visible
                  </span>
                </label>
              )}
            </form.Field>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaStep;
