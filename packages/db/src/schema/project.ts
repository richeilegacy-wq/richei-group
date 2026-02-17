import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  boolean,
  numeric,
  integer,
  index,
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core";

import { user, session, account } from "./auth";

export const projectTypeEnum = pgEnum("project_type", [
  "ESTATE",
  "LAND",
  "PROPERTY",
  "BUILDING",
  "FARM",
  "OTHER",
]);

export const projectStatusEnum = pgEnum("project_status", [
  "DRAFT",
  "FUNDING",
  "ACTIVE",
  "PAUSED",
  "COMPLETED",
  "CANCELLED",
  "FAILED",
]);

export const revenueTypeEnum = pgEnum("revenue_type", [
  "RESALE",
  "LEASE",
  "FARMING",
  "RENTAL",
  "APPRECIATION",
  "OTHER",
]);

export const returnTypeEnum = pgEnum("return_type", [
  "FIXED_PERCENTAGE",
  "PROFIT_SHARE",
  "APPRECIATION",
  "PERIODIC_RENTAL",
]);

export const payoutFrequencyEnum = pgEnum("payout_frequency", [
  "MONTHLY",
  "QUARTERLY",
  "BIANNUALLY",
  "YEARLY",
  "AT_EXIT",
  "ON_SALE",
]);

export const feeTypeEnum = pgEnum("fee_type", [
  "UPFRONT",
  "ON_PROFIT",
  "ON_WITHDRAWAL",
  "MANAGEMENT",
]);

export const ownershipTypeEnum = pgEnum("ownership_type", [
  "LEGAL_TITLE",
  "PROFIT_PARTICIPATION",
]);

export const milestoneStatusEnum = pgEnum("milestone_status", [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "DELAYED",
]);

export const documentTypeEnum = pgEnum("document_type", [
  "SURVEY_PLAN",
  "ALLOCATION_LETTER",
  "DEED",
  "CONTRACT",
  "TITLE_CERTIFICATE",
  "OTHER",
]);

export const mediaTypeEnum = pgEnum("media_type", [
  "IMAGE",
  "VIDEO",
  "MAP",
  "FLOOR_PLAN",
]);

export const tokenTypeEnum = pgEnum("token_type", [
  "PARTICIPATION",
  "OWNERSHIP",
  "REWARD",
]);

export const investmentStatusEnum = pgEnum("investment_status", [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "REFUNDED",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "BANK_TRANSFER",
  "FLUTTERWAVE",
  "PAYSTACK",
  "CRYPTO",
]);

export const paymentConfirmationEnum = pgEnum("payment_confirmation", [
  "MANUAL",
  "WEBHOOK",
]);

export const payoutStatusEnum = pgEnum("payout_status", [
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
]);

export const payoutTypeEnum = pgEnum("payout_type", [
  "RETURN",
  "DIVIDEND",
  "EXIT",
  "REFUND",
]);

export const listingStatusEnum = pgEnum("listing_status", [
  "ACTIVE",
  "SOLD",
  "CANCELLED",
  "EXPIRED",
]);

export const underfundingPolicyEnum = pgEnum("underfunding_policy", [
  "REFUND_ALL",
  "PARTIAL_PROCEED",
  "EXTEND_DEADLINE",
]);

export const project = pgTable(
  "project",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    summary: text("summary"),
    type: projectTypeEnum("type").notNull(),
    status: projectStatusEnum("status").default("DRAFT").notNull(),
    ownershipType: ownershipTypeEnum("ownership_type"),
    address: text("address"),
    city: text("city"),
    state: text("state"),
    country: text("country").default("Nigeria"),
    latitude: numeric("latitude"),
    longitude: numeric("longitude"),
    currency: text("currency").default("NGN").notNull(),
    targetAmount: numeric("target_amount").notNull(),
    raisedAmount: numeric("raised_amount").default("0").notNull(),
    minInvestment: numeric("min_investment"),
    maxInvestment: numeric("max_investment"),
    fundingDeadline: timestamp("funding_deadline"),
    underfundingPolicy: underfundingPolicyEnum("underfunding_policy").default(
      "REFUND_ALL",
    ),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    exitDate: timestamp("exit_date"),
    riskLevel: text("risk_level"),
    earlyExitAllowed: boolean("early_exit_allowed").default(false).notNull(),
    earlyExitPenaltyRate: numeric("early_exit_penalty_rate"),
    earlyExitNoticeDays: integer("early_exit_notice_days"),
    secondaryMarketEnabled: boolean("secondary_market_enabled")
      .default(false)
      .notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    createdBy: text("created_by").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("project_slug_idx").on(table.slug),
    index("project_status_idx").on(table.status),
    index("project_type_idx").on(table.type),
  ],
);

export const projectRevenueStream = pgTable(
  "project_revenue_stream",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    type: revenueTypeEnum("type").notNull(),
    description: text("description"),
    expectedReturnRate: numeric("expected_return_rate"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("revenue_stream_projectId_idx").on(table.projectId),
  ],
);

export const projectReturnStructure = pgTable(
  "project_return_structure",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    type: returnTypeEnum("type").notNull(),
    rate: numeric("rate"),
    payoutFrequency: payoutFrequencyEnum("payout_frequency").notNull(),
    description: text("description"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("return_structure_projectId_idx").on(table.projectId),
  ],
);

export const projectFee = pgTable(
  "project_fee",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    type: feeTypeEnum("type").notNull(),
    rate: numeric("rate"),
    fixedAmount: numeric("fixed_amount"),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("fee_projectId_idx").on(table.projectId)],
);

export const projectMilestone = pgTable(
  "project_milestone",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    status: milestoneStatusEnum("status").default("PENDING").notNull(),
    targetDate: timestamp("target_date"),
    completedDate: timestamp("completed_date"),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("milestone_projectId_idx").on(table.projectId)],
);

export const projectDocument = pgTable(
  "project_document",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    type: documentTypeEnum("type").notNull(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    mimeType: text("mime_type"),
    signedBy: text("signed_by"),
    verifiedBy: text("verified_by"),
    isPublic: boolean("is_public").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("document_projectId_idx").on(table.projectId)],
);

export const projectMedia = pgTable(
  "project_media",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    type: mediaTypeEnum("type").notNull(),
    url: text("url").notNull(),
    altText: text("alt_text"),
    sortOrder: integer("sort_order").default(0).notNull(),
    isCover: boolean("is_cover").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("media_projectId_idx").on(table.projectId)],
);

export const projectToken = pgTable(
  "project_token",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    tokenType: tokenTypeEnum("token_type").notNull(),
    name: text("name").notNull(),
    totalSupply: numeric("total_supply").notNull(),
    availableSupply: numeric("available_supply").notNull(),
    pricePerToken: numeric("price_per_token").notNull(),
    currency: text("currency").default("NGN").notNull(),
    isTradeable: boolean("is_tradeable").default(false).notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("token_projectId_idx").on(table.projectId)],
);

export const investment = pgTable(
  "investment",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    tokenId: text("token_id").references(() => projectToken.id, {
      onDelete: "set null",
    }),
    amount: numeric("amount").notNull(),
    currency: text("currency").default("NGN").notNull(),
    tokenAmount: numeric("token_amount"),
    status: investmentStatusEnum("status").default("PENDING").notNull(),
    paymentMethod: paymentMethodEnum("payment_method").notNull(),
    paymentReference: text("payment_reference"),
    confirmationType: paymentConfirmationEnum("confirmation_type"),
    confirmedAt: timestamp("confirmed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("investment_projectId_idx").on(table.projectId),
    index("investment_userId_idx").on(table.userId),
    index("investment_status_idx").on(table.status),
  ],
);

export const payout = pgTable(
  "payout",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    investmentId: text("investment_id")
      .notNull()
      .references(() => investment.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    amount: numeric("amount").notNull(),
    currency: text("currency").default("NGN").notNull(),
    type: payoutTypeEnum("type").notNull(),
    status: payoutStatusEnum("status").default("PENDING").notNull(),
    paidAt: timestamp("paid_at"),
    reference: text("reference"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("payout_projectId_idx").on(table.projectId),
    index("payout_userId_idx").on(table.userId),
    index("payout_status_idx").on(table.status),
  ],
);

export const projectUpdate = pgTable(
  "project_update",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    content: text("content").notNull(),
    createdBy: text("created_by").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("update_projectId_idx").on(table.projectId)],
);

export const secondaryListing = pgTable(
  "secondary_listing",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    sellerId: text("seller_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    buyerId: text("buyer_id").references(() => user.id, {
      onDelete: "set null",
    }),
    tokenId: text("token_id")
      .notNull()
      .references(() => projectToken.id, { onDelete: "cascade" }),
    tokenAmount: numeric("token_amount").notNull(),
    pricePerToken: numeric("price_per_token").notNull(),
    totalPrice: numeric("total_price").notNull(),
    status: listingStatusEnum("status").default("ACTIVE").notNull(),
    listedAt: timestamp("listed_at").defaultNow().notNull(),
    soldAt: timestamp("sold_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("listing_projectId_idx").on(table.projectId),
    index("listing_sellerId_idx").on(table.sellerId),
    index("listing_status_idx").on(table.status),
  ],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  investments: many(investment),
  payouts: many(payout),
  secondaryListingsAsSeller: many(secondaryListing, {
    relationName: "seller",
  }),
  secondaryListingsAsBuyer: many(secondaryListing, {
    relationName: "buyer",
  }),
}));

export const projectRelations = relations(project, ({ one, many }) => ({
  creator: one(user, {
    fields: [project.createdBy],
    references: [user.id], 
  }),
  revenueStreams: many(projectRevenueStream),
  returnStructures: many(projectReturnStructure),
  fees: many(projectFee),
  milestones: many(projectMilestone),
  documents: many(projectDocument),
  media: many(projectMedia),
  tokens: many(projectToken),
  investments: many(investment),
  payouts: many(payout),
  updates: many(projectUpdate),
  secondaryListings: many(secondaryListing),
}));

export const projectRevenueStreamRelations = relations(
  projectRevenueStream,
  ({ one }) => ({
    project: one(project, {
      fields: [projectRevenueStream.projectId],
      references: [project.id],
    }),
  }),
);

export const projectReturnStructureRelations = relations(
  projectReturnStructure,
  ({ one }) => ({
    project: one(project, {
      fields: [projectReturnStructure.projectId],
      references: [project.id],
    }),
  }),
);

export const projectFeeRelations = relations(projectFee, ({ one }) => ({
  project: one(project, {
    fields: [projectFee.projectId],
    references: [project.id],
  }),
}));

export const projectMilestoneRelations = relations(
  projectMilestone,
  ({ one }) => ({
    project: one(project, {
      fields: [projectMilestone.projectId],
      references: [project.id],
    }),
  }),
);

export const projectDocumentRelations = relations(
  projectDocument,
  ({ one }) => ({
    project: one(project, {
      fields: [projectDocument.projectId],
      references: [project.id],
    }),
  }),
);

export const projectMediaRelations = relations(projectMedia, ({ one }) => ({
  project: one(project, {
    fields: [projectMedia.projectId],
    references: [project.id],
  }),
}));

export const projectTokenRelations = relations(
  projectToken,
  ({ one, many }) => ({
    project: one(project, {
      fields: [projectToken.projectId],
      references: [project.id],
    }),
    investments: many(investment),
    secondaryListings: many(secondaryListing),
  }),
);

export const investmentRelations = relations(investment, ({ one, many }) => ({
  project: one(project, {
    fields: [investment.projectId],
    references: [project.id],
  }),
  user: one(user, {
    fields: [investment.userId],
    references: [user.id],
  }),
  token: one(projectToken, {
    fields: [investment.tokenId],
    references: [projectToken.id],
  }),
  payouts: many(payout),
}));

export const payoutRelations = relations(payout, ({ one }) => ({
  project: one(project, {
    fields: [payout.projectId],
    references: [project.id],
  }),
  investment: one(investment, {
    fields: [payout.investmentId],
    references: [investment.id],
  }),
  user: one(user, {
    fields: [payout.userId],
    references: [user.id],
  }),
}));

export const projectUpdateRelations = relations(projectUpdate, ({ one }) => ({
  project: one(project, {
    fields: [projectUpdate.projectId],
    references: [project.id],
  }),
  creator: one(user, {
    fields: [projectUpdate.createdBy],
    references: [user.id],
  }),
}));

export const secondaryListingRelations = relations(
  secondaryListing,
  ({ one }) => ({
    project: one(project, {
      fields: [secondaryListing.projectId],
      references: [project.id],
    }),
    seller: one(user, {
      fields: [secondaryListing.sellerId],
      references: [user.id],
      relationName: "seller",
    }),
    buyer: one(user, {
      fields: [secondaryListing.buyerId],
      references: [user.id],
      relationName: "buyer",
    }),
    token: one(projectToken, {
      fields: [secondaryListing.tokenId],
      references: [projectToken.id],
    }),
  }),
);