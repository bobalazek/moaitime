ALTER TABLE "users" ADD COLUMN "oauth_google_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_oauth_google_id_unique" UNIQUE("oauth_google_id");