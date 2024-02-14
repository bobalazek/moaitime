CREATE TABLE IF NOT EXISTS "user_activity_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"last_active_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_activity_entries_user_id_idx" ON "user_activity_entries" ("user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_activity_entries" ADD CONSTRAINT "user_activity_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
