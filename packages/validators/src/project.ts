import { z } from "zod";

export const revenueStreamSchema = z.object({
  type: z.enum([
    "RESALE",
    "LEASE",
    "FARMING",
    "RENTAL",
    "APPRECIATION",
    "OTHER",
  ]),
  description: z.string().optional(),
  expectedReturnRate: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const returnStructureSchema = z.object({
  type: z.enum([
    "FIXED_PERCENTAGE",
    "PROFIT_SHARE",
    "APPRECIATION",
    "PERIODIC_RENTAL",
  ]),
  rate: z.string().optional(),
  payoutFrequency: z.enum([
    "MONTHLY",
    "QUARTERLY",
    "BIANNUALLY",
    "YEARLY",
    "AT_EXIT",
    "ON_SALE",
  ]),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const feeSchema = z.object({
  type: z.enum(["UPFRONT", "ON_PROFIT", "ON_WITHDRAWAL", "MANAGEMENT"]),
  rate: z.string().optional(),
  fixedAmount: z.string().optional(),
  description: z.string().optional(),
});

export const milestoneSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: z
    .enum(["PENDING", "IN_PROGRESS", "COMPLETED", "DELAYED"])
    .default("PENDING"),
  targetDate: z.coerce.date().optional(),
  sortOrder: z.number().int().default(0),
});

export const documentSchema = z.object({
  type: z.enum([
    "SURVEY_PLAN",
    "ALLOCATION_LETTER",
    "DEED",
    "CONTRACT",
    "TITLE_CERTIFICATE",
    "OTHER",
  ]),
  name: z.string().min(1),
  url: z.url(),
  mimeType: z.string().optional(),
  signedBy: z.string().optional(),
  verifiedBy: z.string().optional(),
  isPublic: z.boolean().default(false),
});

export const mediaSchema = z.object({
  type: z.enum(["IMAGE", "VIDEO", "MAP", "FLOOR_PLAN"]),
  url: z.url(),
  altText: z.string().optional(),
  sortOrder: z.number().int().default(0),
  isCover: z.boolean().default(false),
});

export const tokenSchema = z.object({
  tokenType: z.enum(["PARTICIPATION", "OWNERSHIP", "REWARD"]),
  name: z.string().min(1),
  totalSupply: z.string(),
  availableSupply: z.string(),
  pricePerToken: z.string(),
  currency: z.string().default("NGN"),
  isTradeable: z.boolean().default(false),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const createProjectSchema = z.object({
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase alphanumeric with hyphens",
    ),
  description: z.string().optional(),
  summary: z.string().optional(),
  type: z.enum(["ESTATE", "LAND", "PROPERTY", "BUILDING", "FARM", "OTHER"]),
  status: z
    .enum([
      "DRAFT",
      "FUNDING",
      "ACTIVE",
      "PAUSED",
      "COMPLETED",
      "CANCELLED",
      "FAILED",
    ])
    .default("DRAFT"),
  ownershipType: z.enum(["LEGAL_TITLE", "PROFIT_PARTICIPATION"]).optional(),

  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().default("Nigeria"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),

  currency: z.string().default("NGN"),
  targetAmount: z.string(),
  minInvestment: z.string().optional(),
  maxInvestment: z.string().optional(),

  fundingDeadline: z.coerce.date().optional(),
  underfundingPolicy: z
    .enum(["REFUND_ALL", "PARTIAL_PROCEED", "EXTEND_DEADLINE"])
    .default("REFUND_ALL"),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  exitDate: z.coerce.date().optional(),

  riskLevel: z.string().optional(),
  earlyExitAllowed: z.boolean().default(false),
  earlyExitPenaltyRate: z.string().optional(),
  earlyExitNoticeDays: z.number().int().optional(),
  secondaryMarketEnabled: z.boolean().default(false),
  isFeatured: z.boolean().default(false),

  revenueStreams: z.array(revenueStreamSchema).optional(),
  returnStructures: z.array(returnStructureSchema).optional(),
  fees: z.array(feeSchema).optional(),
  milestones: z.array(milestoneSchema).optional(),
  documents: z.array(documentSchema).optional(),
  media: z.array(mediaSchema).optional(),
  tokens: z.array(tokenSchema).optional(),
});

export const updateProjectSchema = createProjectSchema
  .omit({ slug: true })
  .partial()
  .extend({ id: z.string() });

export const projectFilterSchema = z.object({
  type: z
    .enum(["ESTATE", "LAND", "PROPERTY", "BUILDING", "FARM", "OTHER"])
    .optional(),
  status: z
    .enum([
      "DRAFT",
      "FUNDING",
      "ACTIVE",
      "PAUSED",
      "COMPLETED",
      "CANCELLED",
      "FAILED",
    ])
    .optional(),
  isFeatured: z.boolean().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectFilterInput = z.infer<typeof projectFilterSchema>;
export type RevenueStreamInput = z.infer<typeof revenueStreamSchema>;
export type ReturnStructureInput = z.infer<typeof returnStructureSchema>;
export type FeeInput = z.infer<typeof feeSchema>;
export type MilestoneInput = z.infer<typeof milestoneSchema>;
export type DocumentInput = z.infer<typeof documentSchema>;
export type MediaInput = z.infer<typeof mediaSchema>;
export type TokenInput = z.infer<typeof tokenSchema>;
