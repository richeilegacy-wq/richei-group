import { z } from "zod";

/** Transform empty strings to undefined so optional numeric DB columns receive NULL instead of "" */
const emptyToUndefined = (val: string | undefined) =>
  val === "" ? undefined : val;

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
  expectedReturnRate: z.string().optional().transform(emptyToUndefined),
  isActive: z.boolean().default(true),
});

export const returnStructureSchema = z.object({
  type: z.enum([
    "FIXED_PERCENTAGE",
    "PROFIT_SHARE",
    "APPRECIATION",
    "PERIODIC_RENTAL",
  ]),
  rate: z.string().optional().transform(emptyToUndefined),
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
  rate: z.string().optional().transform(emptyToUndefined),
  fixedAmount: z.string().optional().transform(emptyToUndefined),
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

// --- Helpers for cross-field validation ---

const numericString = z
  .string()
  .regex(/^\d+(\.\d+)?$/, "Must be a valid number");

const positiveNumericString = z
  .string()
  .regex(/^\d+(\.\d+)?$/, "Must be a valid number")
  .refine((val) => parseFloat(val) > 0, "Must be greater than 0");

// --- Main schema ---

const _createProjectBaseSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
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
  latitude: z.string().optional().transform(emptyToUndefined),
  longitude: z.string().optional().transform(emptyToUndefined),

  currency: z.string().default("NGN"),
  targetAmount: positiveNumericString,
  minInvestment: numericString
    .optional()
    .or(z.literal(""))
    .transform(emptyToUndefined),
  maxInvestment: numericString
    .optional()
    .or(z.literal(""))
    .transform(emptyToUndefined),

  fundingDeadline: z.coerce.date().optional(),
  underfundingPolicy: z
    .enum(["REFUND_ALL", "PARTIAL_PROCEED", "EXTEND_DEADLINE"])
    .default("REFUND_ALL"),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  exitDate: z.coerce.date().optional(),

  riskLevel: z.string().optional(),
  earlyExitAllowed: z.boolean().default(false),
  earlyExitPenaltyRate: z.string().optional().transform(emptyToUndefined),
  earlyExitNoticeDays: z.number().int().min(0).optional(),
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

/** Cross-field refinement applied to both create and update schemas */
function projectRefinement(
  data: z.infer<typeof _createProjectBaseSchema>,
  ctx: z.RefinementCtx,
) {
  const minVal = data.minInvestment
    ? parseFloat(data.minInvestment)
    : undefined;
  const maxVal = data.maxInvestment
    ? parseFloat(data.maxInvestment)
    : undefined;
  const targetVal = parseFloat(data.targetAmount);

  // minInvestment must not be greater than maxInvestment
  if (minVal != null && maxVal != null && minVal > maxVal) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["minInvestment"],
      message: "Minimum investment cannot be greater than maximum investment",
    });
  }

  // maxInvestment must not exceed targetAmount
  if (maxVal != null && !isNaN(targetVal) && maxVal > targetVal) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["maxInvestment"],
      message: "Maximum investment cannot exceed the target amount",
    });
  }

  // minInvestment must not exceed targetAmount
  if (minVal != null && !isNaN(targetVal) && minVal > targetVal) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["minInvestment"],
      message: "Minimum investment cannot exceed the target amount",
    });
  }

  // startDate must be before endDate
  if (data.startDate && data.endDate && data.startDate >= data.endDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["endDate"],
      message: "End date must be after start date",
    });
  }

  // endDate must be before exitDate
  if (data.endDate && data.exitDate && data.endDate >= data.exitDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["exitDate"],
      message: "Exit date must be after end date",
    });
  }

  // startDate must be after or equal to exitDate (if both provided without endDate)
  if (
    data.startDate &&
    data.exitDate &&
    !data.endDate &&
    data.startDate >= data.exitDate
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["exitDate"],
      message: "Exit date must be after start date",
    });
  }

  // fundingDeadline should be before or equal to startDate
  if (
    data.fundingDeadline &&
    data.startDate &&
    data.fundingDeadline > data.startDate
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["fundingDeadline"],
      message: "Funding deadline should be on or before the start date",
    });
  }

  // earlyExitPenaltyRate must be a valid percentage when provided
  if (data.earlyExitAllowed && data.earlyExitPenaltyRate) {
    const rate = parseFloat(data.earlyExitPenaltyRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["earlyExitPenaltyRate"],
        message: "Penalty rate must be between 0 and 100",
      });
    }
  }
}

// createProjectSchema = base + refinements
export const createProjectSchema =
  _createProjectBaseSchema.superRefine(projectRefinement);

// updateProjectSchema = base (without slug) + partial + id, then refinements
export const updateProjectSchema = _createProjectBaseSchema
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

export const userProjectListSchema = z.object({
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
  search: z.string().optional(),
  sortBy: z
    .enum([
      "name",
      "createdAt",
      "targetAmount",
      "raisedAmount",
      "status",
      "type",
    ])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export const adminProjectFilterSchema = z.object({
  // --- Enum filters ---
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
  ownershipType: z.enum(["LEGAL_TITLE", "PROFIT_PARTICIPATION"]).optional(),

  // --- Boolean filters ---
  isFeatured: z.boolean().optional(),
  earlyExitAllowed: z.boolean().optional(),
  secondaryMarketEnabled: z.boolean().optional(),

  // --- Location filters ---
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),

  // --- Date range filters ---
  createdAfter: z.coerce.date().optional(),
  createdBefore: z.coerce.date().optional(),

  // --- Funding range filters ---
  minTargetAmount: z.string().optional(),
  maxTargetAmount: z.string().optional(),

  // --- Sorting ---
  sortBy: z
    .enum([
      "name",
      "createdAt",
      "updatedAt",
      "targetAmount",
      "raisedAmount",
      "status",
      "type",
    ])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),

  // --- Pagination (page-based) ---
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export const adminProjectSearchSchema = z.object({
  /** The search query, matched against name, slug, and description */
  query: z.string().min(1, "Search query is required"),

  // Optional narrowing filters
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

  // --- Pagination ---
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(10),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectFilterInput = z.infer<typeof projectFilterSchema>;
export type UserProjectListInput = z.infer<typeof userProjectListSchema>;
export type AdminProjectFilterInput = z.infer<typeof adminProjectFilterSchema>;
export type AdminProjectSearchInput = z.infer<typeof adminProjectSearchSchema>;
export type RevenueStreamInput = z.infer<typeof revenueStreamSchema>;
export type ReturnStructureInput = z.infer<typeof returnStructureSchema>;
export type FeeInput = z.infer<typeof feeSchema>;
export type MilestoneInput = z.infer<typeof milestoneSchema>;
export type DocumentInput = z.infer<typeof documentSchema>;
export type MediaInput = z.infer<typeof mediaSchema>;
export type TokenInput = z.infer<typeof tokenSchema>;
