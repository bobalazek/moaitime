ALTER TABLE "events" ADD COLUMN "user_id" uuid;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_user_id_idx" ON "events" ("user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
