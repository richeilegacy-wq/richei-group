CREATE TYPE "public"."document_type" AS ENUM('SURVEY_PLAN', 'ALLOCATION_LETTER', 'DEED', 'CONTRACT', 'TITLE_CERTIFICATE', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."fee_type" AS ENUM('UPFRONT', 'ON_PROFIT', 'ON_WITHDRAWAL', 'MANAGEMENT');--> statement-breakpoint
CREATE TYPE "public"."investment_status" AS ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "public"."listing_status" AS ENUM('ACTIVE', 'SOLD', 'CANCELLED', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('IMAGE', 'VIDEO', 'MAP', 'FLOOR_PLAN');--> statement-breakpoint
CREATE TYPE "public"."milestone_status" AS ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED');--> statement-breakpoint
CREATE TYPE "public"."ownership_type" AS ENUM('LEGAL_TITLE', 'PROFIT_PARTICIPATION');--> statement-breakpoint
CREATE TYPE "public"."payment_confirmation" AS ENUM('MANUAL', 'WEBHOOK');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('BANK_TRANSFER', 'FLUTTERWAVE', 'PAYSTACK', 'CRYPTO');--> statement-breakpoint
CREATE TYPE "public"."payout_frequency" AS ENUM('MONTHLY', 'QUARTERLY', 'BIANNUALLY', 'YEARLY', 'AT_EXIT', 'ON_SALE');--> statement-breakpoint
CREATE TYPE "public"."payout_status" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."payout_type" AS ENUM('RETURN', 'DIVIDEND', 'EXIT', 'REFUND');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('DRAFT', 'FUNDING', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."project_type" AS ENUM('ESTATE', 'LAND', 'PROPERTY', 'BUILDING', 'FARM', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."return_type" AS ENUM('FIXED_PERCENTAGE', 'PROFIT_SHARE', 'APPRECIATION', 'PERIODIC_RENTAL');--> statement-breakpoint
CREATE TYPE "public"."revenue_type" AS ENUM('RESALE', 'LEASE', 'FARMING', 'RENTAL', 'APPRECIATION', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."token_type" AS ENUM('PARTICIPATION', 'OWNERSHIP', 'REWARD');--> statement-breakpoint
CREATE TYPE "public"."underfunding_policy" AS ENUM('REFUND_ALL', 'PARTIAL_PROCEED', 'EXTEND_DEADLINE');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text DEFAULT 'USER' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "investment" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"user_id" text NOT NULL,
	"token_id" text,
	"amount" numeric NOT NULL,
	"currency" text DEFAULT 'NGN' NOT NULL,
	"token_amount" numeric,
	"status" "investment_status" DEFAULT 'PENDING' NOT NULL,
	"payment_method" "payment_method" NOT NULL,
	"payment_reference" text,
	"confirmation_type" "payment_confirmation",
	"confirmed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payout" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"investment_id" text NOT NULL,
	"user_id" text NOT NULL,
	"amount" numeric NOT NULL,
	"currency" text DEFAULT 'NGN' NOT NULL,
	"type" "payout_type" NOT NULL,
	"status" "payout_status" DEFAULT 'PENDING' NOT NULL,
	"paid_at" timestamp,
	"reference" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"summary" text,
	"type" "project_type" NOT NULL,
	"status" "project_status" DEFAULT 'DRAFT' NOT NULL,
	"ownership_type" "ownership_type",
	"address" text,
	"city" text,
	"state" text,
	"country" text DEFAULT 'Nigeria',
	"latitude" numeric,
	"longitude" numeric,
	"currency" text DEFAULT 'NGN' NOT NULL,
	"target_amount" numeric NOT NULL,
	"raised_amount" numeric DEFAULT '0' NOT NULL,
	"min_investment" numeric,
	"max_investment" numeric,
	"funding_deadline" timestamp,
	"underfunding_policy" "underfunding_policy" DEFAULT 'REFUND_ALL',
	"start_date" timestamp,
	"end_date" timestamp,
	"exit_date" timestamp,
	"risk_level" text,
	"early_exit_allowed" boolean DEFAULT false NOT NULL,
	"early_exit_penalty_rate" numeric,
	"early_exit_notice_days" integer,
	"secondary_market_enabled" boolean DEFAULT false NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "project_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "project_document" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"type" "document_type" NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"mime_type" text,
	"signed_by" text,
	"verified_by" text,
	"is_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_fee" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"type" "fee_type" NOT NULL,
	"rate" numeric,
	"fixed_amount" numeric,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_media" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"type" "media_type" NOT NULL,
	"url" text NOT NULL,
	"alt_text" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_cover" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_milestone" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" "milestone_status" DEFAULT 'PENDING' NOT NULL,
	"target_date" timestamp,
	"completed_date" timestamp,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_return_structure" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"type" "return_type" NOT NULL,
	"rate" numeric,
	"payout_frequency" "payout_frequency" NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_revenue_stream" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"type" "revenue_type" NOT NULL,
	"description" text,
	"expected_return_rate" numeric,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_token" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"token_type" "token_type" NOT NULL,
	"name" text NOT NULL,
	"total_supply" numeric NOT NULL,
	"available_supply" numeric NOT NULL,
	"price_per_token" numeric NOT NULL,
	"currency" text DEFAULT 'NGN' NOT NULL,
	"is_tradeable" boolean DEFAULT false NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_update" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "secondary_listing" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"seller_id" text NOT NULL,
	"buyer_id" text,
	"token_id" text NOT NULL,
	"token_amount" numeric NOT NULL,
	"price_per_token" numeric NOT NULL,
	"total_price" numeric NOT NULL,
	"status" "listing_status" DEFAULT 'ACTIVE' NOT NULL,
	"listed_at" timestamp DEFAULT now() NOT NULL,
	"sold_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investment" ADD CONSTRAINT "investment_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investment" ADD CONSTRAINT "investment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investment" ADD CONSTRAINT "investment_token_id_project_token_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."project_token"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payout" ADD CONSTRAINT "payout_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payout" ADD CONSTRAINT "payout_investment_id_investment_id_fk" FOREIGN KEY ("investment_id") REFERENCES "public"."investment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payout" ADD CONSTRAINT "payout_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_document" ADD CONSTRAINT "project_document_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_fee" ADD CONSTRAINT "project_fee_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_media" ADD CONSTRAINT "project_media_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_milestone" ADD CONSTRAINT "project_milestone_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_return_structure" ADD CONSTRAINT "project_return_structure_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_revenue_stream" ADD CONSTRAINT "project_revenue_stream_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_token" ADD CONSTRAINT "project_token_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_update" ADD CONSTRAINT "project_update_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_update" ADD CONSTRAINT "project_update_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "secondary_listing" ADD CONSTRAINT "secondary_listing_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "secondary_listing" ADD CONSTRAINT "secondary_listing_seller_id_user_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "secondary_listing" ADD CONSTRAINT "secondary_listing_buyer_id_user_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "secondary_listing" ADD CONSTRAINT "secondary_listing_token_id_project_token_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."project_token"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "investment_projectId_idx" ON "investment" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "investment_userId_idx" ON "investment" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "investment_status_idx" ON "investment" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payout_projectId_idx" ON "payout" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "payout_userId_idx" ON "payout" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payout_status_idx" ON "payout" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "project_slug_idx" ON "project" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "project_status_idx" ON "project" USING btree ("status");--> statement-breakpoint
CREATE INDEX "project_type_idx" ON "project" USING btree ("type");--> statement-breakpoint
CREATE INDEX "document_projectId_idx" ON "project_document" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "fee_projectId_idx" ON "project_fee" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "media_projectId_idx" ON "project_media" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "milestone_projectId_idx" ON "project_milestone" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "return_structure_projectId_idx" ON "project_return_structure" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "revenue_stream_projectId_idx" ON "project_revenue_stream" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "token_projectId_idx" ON "project_token" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "update_projectId_idx" ON "project_update" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "listing_projectId_idx" ON "secondary_listing" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "listing_sellerId_idx" ON "secondary_listing" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "listing_status_idx" ON "secondary_listing" USING btree ("status");