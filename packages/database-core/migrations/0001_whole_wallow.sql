ALTER TABLE "users" ADD COLUMN "deletion_token" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_deletion_token_unique" UNIQUE("deletion_token");