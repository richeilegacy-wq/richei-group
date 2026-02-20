export type RevenueStreamValue = {
  type: string;
  description: string;
  expectedReturnRate: string;
  isActive: boolean;
};

export type ReturnStructureValue = {
  type: string;
  rate: string;
  payoutFrequency: string;
  description: string;
  isActive: boolean;
};

export type FeeValue = {
  type: string;
  rate: string;
  fixedAmount: string;
  description: string;
};

export type MilestoneValue = {
  name: string;
  description: string;
  status: string;
  targetDate: string;
  sortOrder: number;
};

export type DocumentValue = {
  type: string;
  name: string;
  url: string;
  mimeType: string;
  signedBy: string;
  verifiedBy: string;
  isPublic: boolean;
};

export type MediaValue = {
  type: string;
  url: string;
  altText: string;
  sortOrder: number;
  isCover: boolean;
};

export type TokenValue = {
  tokenType: string;
  name: string;
  totalSupply: string;
  availableSupply: string;
  pricePerToken: string;
  currency: string;
  isTradeable: boolean;
  metadata?: Record<string, unknown>;
};

export type ProjectFormValues = {
  name: string;
  slug: string;
  description: string;
  summary: string;
  type: string;
  status: string;
  ownershipType: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: string;
  longitude: string;
  currency: string;
  targetAmount: string;
  minInvestment: string;
  maxInvestment: string;
  fundingDeadline: string;
  underfundingPolicy: string;
  startDate: string;
  endDate: string;
  exitDate: string;
  riskLevel: string;
  earlyExitAllowed: boolean;
  earlyExitPenaltyRate: string;
  earlyExitNoticeDays: number | undefined;
  secondaryMarketEnabled: boolean;
  isFeatured: boolean;
  revenueStreams: RevenueStreamValue[];
  returnStructures: ReturnStructureValue[];
  fees: FeeValue[];
  milestones: MilestoneValue[];
  documents: DocumentValue[];
  media: MediaValue[];
  tokens: TokenValue[];
};

export type StepProps = {
  form: any; // eslint-disable-line
};

export type ReviewStepProps = StepProps & {
  onGoToStep: (step: number) => void;
};

export const INPUT_CLASS =
  "h-12 rounded-lg border-gray-200 text-sm focus-visible:border-primary focus-visible:ring-primary/20";

export const INPUT_ERROR_CLASS =
  "h-12 rounded-lg border-destructive text-sm focus-visible:border-destructive focus-visible:ring-destructive/20";

export const SELECT_CLASS =
  "w-full h-12 rounded-lg border-gray-200 text-sm focus-visible:border-primary focus-visible:ring-primary/20";

export const SELECT_ERROR_CLASS =
  "w-full h-12 rounded-lg border-destructive text-sm focus-visible:border-destructive focus-visible:ring-destructive/20";

export const LABEL_CLASS = "text-sm font-medium text-foreground";

export function getOptionLabel(
  options: readonly { value: string; label: string }[],
  value: string | null | undefined,
): string | undefined {
  if (!value) return undefined;
  return options.find((o) => o.value === value)?.label;
}

/** Returns the appropriate input class based on whether there are errors */
export function inputClass(hasError: boolean) {
  return hasError ? INPUT_ERROR_CLASS : INPUT_CLASS;
}

/** Returns the appropriate select class based on whether there are errors */
export function selectClass(hasError: boolean) {
  return hasError ? SELECT_ERROR_CLASS : SELECT_CLASS;
}

// ---- Inline validation helpers ----

export function validateNumericString(value: string): string | null {
  if (!value) return null;
  if (!/^\d+(\.\d+)?$/.test(value)) return "Must be a valid number";
  return null;
}

export function validatePositiveNumericString(value: string): string | null {
  if (!value) return null;
  const err = validateNumericString(value);
  if (err) return err;
  if (parseFloat(value) <= 0) return "Must be greater than 0";
  return null;
}

export function validateMinMaxInvestment(
  min: string,
  max: string,
  target: string,
): { minError: string | null; maxError: string | null } {
  const result = {
    minError: null as string | null,
    maxError: null as string | null,
  };
  const minVal = min ? parseFloat(min) : undefined;
  const maxVal = max ? parseFloat(max) : undefined;
  const targetVal = target ? parseFloat(target) : undefined;

  if (
    minVal != null &&
    maxVal != null &&
    !isNaN(minVal) &&
    !isNaN(maxVal) &&
    minVal > maxVal
  ) {
    result.minError = "Minimum cannot be greater than maximum";
  }
  if (
    maxVal != null &&
    targetVal != null &&
    !isNaN(maxVal) &&
    !isNaN(targetVal) &&
    maxVal > targetVal
  ) {
    result.maxError = "Cannot exceed target amount";
  }
  if (
    minVal != null &&
    targetVal != null &&
    !isNaN(minVal) &&
    !isNaN(targetVal) &&
    minVal > targetVal
  ) {
    result.minError = result.minError || "Cannot exceed target amount";
  }
  return result;
}

export function validateDateOrder(
  startDate: string,
  endDate: string,
  exitDate: string,
  fundingDeadline: string,
): {
  startError: string | null;
  endError: string | null;
  exitError: string | null;
  fundingError: string | null;
} {
  const result = {
    startError: null as string | null,
    endError: null as string | null,
    exitError: null as string | null,
    fundingError: null as string | null,
  };

  const s = startDate ? new Date(startDate) : null;
  const e = endDate ? new Date(endDate) : null;
  const ex = exitDate ? new Date(exitDate) : null;
  const fd = fundingDeadline ? new Date(fundingDeadline) : null;

  if (s && e && s >= e) {
    result.endError = "Must be after start date";
  }
  if (e && ex && e >= ex) {
    result.exitError = "Must be after end date";
  }
  if (s && ex && !e && s >= ex) {
    result.exitError = "Must be after start date";
  }
  if (fd && s && fd > s) {
    result.fundingError = "Should be on or before start date";
  }

  return result;
}

export function validatePenaltyRate(value: string): string | null {
  if (!value) return null;
  const num = parseFloat(value);
  if (isNaN(num)) return "Must be a valid number";
  if (num < 0 || num > 100) return "Must be between 0 and 100";
  return null;
}

export function validateSlug(value: string): string | null {
  if (!value) return null;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    return "Must be lowercase letters, numbers, and hyphens only";
  }
  return null;
}
