ALTER TABLE "user_followed_users" ADD COLUMN "approved_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_private" boolean DEFAULT false;