ALTER TABLE "users" ALTER COLUMN "roles" SET DEFAULT '["user"]';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "locked_reason" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "locked_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "locked_until_at" timestamp;