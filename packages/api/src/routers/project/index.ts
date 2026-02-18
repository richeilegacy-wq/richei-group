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
import {
  createProjectSchema,
  updateProjectSchema,
  projectFilterSchema,
  revenueStreamSchema,
  returnStructureSchema,
  feeSchema,
  milestoneSchema,
  documentSchema,
  mediaSchema,
  tokenSchema,
} from "@richei-group/validators";

import { adminProcedure, protectedProcedure, publicProcedure } from "../..";

function generateId() {
  return crypto.randomUUID();
}

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
