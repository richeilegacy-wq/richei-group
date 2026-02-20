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

export const SELECT_CLASS =
  "w-full h-12 rounded-lg border-gray-200 text-sm focus-visible:border-primary focus-visible:ring-primary/20";

export const LABEL_CLASS = "text-sm font-medium text-foreground";

export function getOptionLabel(
  options: readonly { value: string; label: string }[],
  value: string | null | undefined,
): string | undefined {
  if (!value) return undefined;
  return options.find((o) => o.value === value)?.label;
}
