import { ORPCError } from "@orpc/server";
import { db } from "@richei-group/db";
import {
  project,
  projectRevenueStream,
  projectReturnStructure,
  projectFee,
  projectMilestone,
  projectDocument,
  projectMedia,
  projectToken,
} from "@richei-group/db/schema/project";
import { eq } from "@richei-group/db";
import { z } from "zod";

import { adminProcedure, protectedProcedure, publicProcedure } from "../..";

function generateId() {
  return crypto.randomUUID();
}

const revenueStreamSchema = z.object({
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

const returnStructureSchema = z.object({
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

const feeSchema = z.object({
  type: z.enum(["UPFRONT", "ON_PROFIT", "ON_WITHDRAWAL", "MANAGEMENT"]),
  rate: z.string().optional(),
  fixedAmount: z.string().optional(),
  description: z.string().optional(),
});

const milestoneSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: z
    .enum(["PENDING", "IN_PROGRESS", "COMPLETED", "DELAYED"])
    .default("PENDING"),
  targetDate: z.coerce.date().optional(),
  sortOrder: z.number().int().default(0),
});

const documentSchema = z.object({
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

const mediaSchema = z.object({
  type: z.enum(["IMAGE", "VIDEO", "MAP", "FLOOR_PLAN"]),
  url: z.url(),
  altText: z.string().optional(),
  sortOrder: z.number().int().default(0),
  isCover: z.boolean().default(false),
});

const tokenSchema = z.object({
  tokenType: z.enum(["PARTICIPATION", "OWNERSHIP", "REWARD"]),
  name: z.string().min(1),
  totalSupply: z.string(),
  availableSupply: z.string(),
  pricePerToken: z.string(),
  currency: z.string().default("NGN"),
  isTradeable: z.boolean().default(false),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const createProjectSchema = z.object({
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

const updateProjectSchema = createProjectSchema
  .omit({ slug: true })
  .partial()
  .extend({ id: z.string() });

const projectFilterSchema = z.object({
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

export const projectRouter = {
  create: adminProcedure
    .input(createProjectSchema)
    .handler(async ({ input, context }) => {
      const {
        revenueStreams,
        returnStructures,
        fees,
        milestones,
        documents,
        media,
        tokens,
        slug,
        ...projectData
      } = input;

      const existing = await db
        .select({ id: project.id })
        .from(project)
        .where(eq(project.slug, slug))
        .limit(1);

      if (existing.length > 0) {
        throw new ORPCError("CONFLICT", {
          message: "A project with this slug already exists",
        });
      }

      const projectId = generateId();

      const result = await db.transaction(async (tx) => {
        const [created] = await tx
          .insert(project)
          .values({
            id: projectId,
            slug,
            ...projectData,
            createdBy: context.session.user.id,
          })
          .returning();

        if (revenueStreams?.length) {
          await tx.insert(projectRevenueStream).values(
            revenueStreams.map((rs) => ({
              id: generateId(),
              projectId,
              ...rs,
            })),
          );
        }

        if (returnStructures?.length) {
          await tx.insert(projectReturnStructure).values(
            returnStructures.map((rs) => ({
              id: generateId(),
              projectId,
              ...rs,
            })),
          );
        }

        if (fees?.length) {
          await tx.insert(projectFee).values(
            fees.map((f) => ({
              id: generateId(),
              projectId,
              ...f,
            })),
          );
        }

        if (milestones?.length) {
          await tx.insert(projectMilestone).values(
            milestones.map((m) => ({
              id: generateId(),
              projectId,
              ...m,
            })),
          );
        }

        if (documents?.length) {
          await tx.insert(projectDocument).values(
            documents.map((d) => ({
              id: generateId(),
              projectId,
              ...d,
            })),
          );
        }

        if (media?.length) {
          await tx.insert(projectMedia).values(
            media.map((m) => ({
              id: generateId(),
              projectId,
              ...m,
            })),
          );
        }

        if (tokens?.length) {
          await tx.insert(projectToken).values(
            tokens.map((t) => ({
              id: generateId(),
              projectId,
              ...t,
            })),
          );
        }

        return created;
      });

      return result;
    }),

  update: adminProcedure
    .input(updateProjectSchema)
    .handler(async ({ input }) => {}),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {}),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .handler(async ({ input }) => {}),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {}),

  list: publicProcedure
    .input(projectFilterSchema)
    .handler(async ({ input }) => {}),

  addRevenueStream: adminProcedure
    .input(revenueStreamSchema.extend({ projectId: z.string() }))
    .handler(async ({ input }) => {}),

  addReturnStructure: adminProcedure
    .input(returnStructureSchema.extend({ projectId: z.string() }))
    .handler(async ({ input }) => {}),

  addFee: adminProcedure
    .input(feeSchema.extend({ projectId: z.string() }))
    .handler(async ({ input }) => {}),

  addMilestone: adminProcedure
    .input(milestoneSchema.extend({ projectId: z.string() }))
    .handler(async ({ input }) => {}),

  updateMilestone: adminProcedure
    .input(milestoneSchema.partial().extend({ id: z.string() }))
    .handler(async ({ input }) => {}),

  addDocument: adminProcedure
    .input(documentSchema.extend({ projectId: z.string() }))
    .handler(async ({ input }) => {}),

  addMedia: adminProcedure
    .input(mediaSchema.extend({ projectId: z.string() }))
    .handler(async ({ input }) => {}),

  addToken: adminProcedure
    .input(tokenSchema.extend({ projectId: z.string() }))
    .handler(async ({ input }) => {}),

  removeChild: adminProcedure
    .input(
      z.object({
        id: z.string(),
        table: z.enum([
          "revenueStream",
          "returnStructure",
          "fee",
          "milestone",
          "document",
          "media",
          "token",
        ]),
      }),
    )
    .handler(async ({ input }) => {}),

  postUpdate: adminProcedure
    .input(
      z.object({
        projectId: z.string(),
        title: z.string().min(1),
        content: z.string().min(1),
      }),
    )
    .handler(async ({ input }) => {}),

  invest: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        tokenId: z.string().optional(),
        amount: z.string(),
        tokenAmount: z.string().optional(),
        paymentMethod: z.enum([
          "BANK_TRANSFER",
          "FLUTTERWAVE",
          "PAYSTACK",
          "CRYPTO",
        ]),
        paymentReference: z.string().optional(),
      }),
    )
    .handler(async ({ input }) => {}),

  myInvestments: protectedProcedure.handler(async ({ input }) => {}),
};
