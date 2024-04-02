ALTER TABLE "users" DROP CONSTRAINT "users_oauth_google_id_unique";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "oauth_google_id";