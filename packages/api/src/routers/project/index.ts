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
  investment,
  payout,
  secondaryListing,
} from "@richei-group/db/schema/project";
import {
  eq,
  and,
  or,
  ilike,
  gte,
  lte,
  asc,
  desc,
  count,
  type SQL,
} from "@richei-group/db";
import { z } from "zod";
import {
  createProjectSchema,
  updateProjectSchema,
  userProjectListSchema,
  revenueStreamSchema,
  returnStructureSchema,
  feeSchema,
  milestoneSchema,
  documentSchema,
  mediaSchema,
  tokenSchema,
  adminProjectFilterSchema,
  adminProjectSearchSchema,
} from "@richei-group/validators";
import { uploadFile } from "@richei-group/uploader";

import { adminProcedure, protectedProcedure, publicProcedure } from "../..";

function generateId() {
  return crypto.randomUUID();
}

/** Column map for dynamic sorting */
const sortColumnMap = {
  name: project.name,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
  targetAmount: project.targetAmount,
  raisedAmount: project.raisedAmount,
  status: project.status,
  type: project.type,
} as const;

export const projectRouter = {
  admin: {
    uploadFile: adminProcedure
      .input(
        z.object({
          file: z.instanceof(File),
          type: z.enum(["IMAGE", "VIDEO", "DOCUMENT"]),
          folder: z.string().optional(),
        }),
      )
      .handler(async ({ input }) => {
        const { file, type, folder } = input;
        const result = await uploadFile(file, type, folder);
        return result;
      }),
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

    getAll: adminProcedure
      .input(adminProjectFilterSchema)
      .handler(async ({ input }) => {
        const {
          type,
          status,
          ownershipType,
          isFeatured,
          earlyExitAllowed,
          secondaryMarketEnabled,
          city,
          state,
          country,
          createdAfter,
          createdBefore,
          minTargetAmount,
          maxTargetAmount,
          sortBy,
          sortOrder,
          page,
          limit,
        } = input;

        // Build WHERE conditions
        const conditions: SQL[] = [];

        // Enum filters
        if (type) conditions.push(eq(project.type, type));
        if (status) conditions.push(eq(project.status, status));
        if (ownershipType)
          conditions.push(eq(project.ownershipType, ownershipType));

        // Boolean filters
        if (isFeatured !== undefined)
          conditions.push(eq(project.isFeatured, isFeatured));
        if (earlyExitAllowed !== undefined)
          conditions.push(eq(project.earlyExitAllowed, earlyExitAllowed));
        if (secondaryMarketEnabled !== undefined)
          conditions.push(
            eq(project.secondaryMarketEnabled, secondaryMarketEnabled),
          );

        // Location filters (case-insensitive partial match)
        if (city) conditions.push(ilike(project.city, `%${city}%`));
        if (state) conditions.push(ilike(project.state, `%${state}%`));
        if (country) conditions.push(ilike(project.country, `%${country}%`));

        // Date range filters
        if (createdAfter) conditions.push(gte(project.createdAt, createdAfter));
        if (createdBefore)
          conditions.push(lte(project.createdAt, createdBefore));

        // Funding range filters
        if (minTargetAmount)
          conditions.push(gte(project.targetAmount, minTargetAmount));
        if (maxTargetAmount)
          conditions.push(lte(project.targetAmount, maxTargetAmount));

        const whereClause =
          conditions.length > 0 ? and(...conditions) : undefined;

        // Sorting
        const sortColumn = sortColumnMap[sortBy];
        const orderFn = sortOrder === "asc" ? asc : desc;

        // Calculate offset from page
        const offset = (page - 1) * limit;

        // Run data + count queries in parallel
        const [items, countResult] = await Promise.all([
          db
            .select()
            .from(project)
            .where(whereClause)
            .orderBy(orderFn(sortColumn))
            .limit(limit)
            .offset(offset),
          db.select({ total: count() }).from(project).where(whereClause),
        ]);

        const total = countResult[0]?.total ?? 0;
        const totalPages = Math.ceil(total / limit);

        return {
          items,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
          },
        };
      }),

    getProject: adminProcedure
      .input(
        z
          .object({ id: z.string().optional(), slug: z.string().optional() })
          .refine(
            (data) => data.id || data.slug,
            "Either id or slug is required",
          ),
      )
      .handler(async ({ input }) => {
        const { id, slug } = input;

        const proj = await db.query.project.findFirst({
          where: id ? eq(project.id, id) : eq(project.slug, slug!),
          with: {
            revenueStreams: true,
            returnStructures: true,
            fees: true,
            milestones: true,
            documents: true,
            media: true,
            tokens: true,
            updates: true,
            creator: {
              columns: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        });

        if (!proj) {
          throw new ORPCError("NOT_FOUND", {
            message: "Project not found",
          });
        }

        const [
          investmentsCountResult,
          payoutsCountResult,
          secondaryListingsCountResult,
        ] = await Promise.all([
          db
            .select({ total: count() })
            .from(investment)
            .where(eq(investment.projectId, proj.id)),
          db
            .select({ total: count() })
            .from(payout)
            .where(eq(payout.projectId, proj.id)),
          db
            .select({ total: count() })
            .from(secondaryListing)
            .where(eq(secondaryListing.projectId, proj.id)),
        ]);

        return {
          ...proj,
          investmentsCount: investmentsCountResult[0]?.total ?? 0,
          payoutsCount: payoutsCountResult[0]?.total ?? 0,
          secondaryListingsCount: secondaryListingsCountResult[0]?.total ?? 0,
        };
      }),

    search: adminProcedure
      .input(adminProjectSearchSchema)
      .handler(async ({ input }) => {
        const { query, type, status, page, limit } = input;

        const pattern = `%${query}%`;

        // Build WHERE conditions — text search is always applied
        const conditions: SQL[] = [
          or(
            ilike(project.name, pattern),
            ilike(project.slug, pattern),
            ilike(project.description, pattern),
          )!,
        ];

        // Optional narrowing filters
        if (type) conditions.push(eq(project.type, type));
        if (status) conditions.push(eq(project.status, status));

        const whereClause = and(...conditions);
        const offset = (page - 1) * limit;

        const [items, countResult] = await Promise.all([
          db
            .select({
              id: project.id,
              name: project.name,
              slug: project.slug,
              type: project.type,
              status: project.status,
              targetAmount: project.targetAmount,
              raisedAmount: project.raisedAmount,
              city: project.city,
              state: project.state,
              isFeatured: project.isFeatured,
              createdAt: project.createdAt,
            })
            .from(project)
            .where(whereClause)
            .orderBy(desc(project.createdAt))
            .limit(limit)
            .offset(offset),
          db.select({ total: count() }).from(project).where(whereClause),
        ]);

        const total = countResult[0]?.total ?? 0;
        const totalPages = Math.ceil(total / limit);

        return {
          items,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
          },
        };
      }),

    update: adminProcedure
      .input(updateProjectSchema)
      .handler(async ({ input }) => {}),

    delete: adminProcedure
      .input(z.object({ id: z.string() }))
      .handler(async ({ input }) => {}),
  },

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .handler(async ({ input }) => {}),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {}),

  list: protectedProcedure
    .input(userProjectListSchema)
    .handler(async ({ input }) => {
      const {
        type,
        status,
        isFeatured,
        search,
        sortBy,
        sortOrder,
        page,
        limit,
      } = input;

      const conditions: SQL[] = [];
      if (type) conditions.push(eq(project.type, type));
      if (status) conditions.push(eq(project.status, status));
      if (isFeatured !== undefined)
        conditions.push(eq(project.isFeatured, isFeatured));
      if (search?.trim()) {
        const pattern = `%${search.trim()}%`;
        conditions.push(
          or(
            ilike(project.name, pattern),
            ilike(project.slug, pattern),
            ilike(project.description, pattern),
          )!,
        );
      }
      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;
      const sortColumn = sortColumnMap[sortBy];
      const offset = (page - 1) * limit;

      const [items, countResult] = await Promise.all([
        db.query.project.findMany({
          where: whereClause,
          columns: {
            createdBy: false,
          },
          with: {
            revenueStreams: true,
            returnStructures: true,
            media: {
              columns: {
                id: true,
                projectId: true,
                type: true,
                url: true,
                altText: true,
                sortOrder: true,
                isCover: true,
              },
            },
          },
          orderBy: (_p, { asc, desc }) => [
            sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn),
          ],
          limit,
          offset,
        }),
        db.select({ total: count() }).from(project).where(whereClause),
      ]);

      const total = Number(countResult[0]?.total ?? 0);
      const totalPages = Math.ceil(total / limit);

      return {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    }),

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
