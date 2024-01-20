CREATE TABLE IF NOT EXISTS "focus_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_text" text,
	"settings" json,
	"started_at" timestamp DEFAULT now(),
	"ends_at" timestamp,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL,
	"task_id" uuid
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "focus_sessions_user_id_idx" ON "focus_sessions" ("user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "focus_sessions" ADD CONSTRAINT "focus_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "focus_sessions" ADD CONSTRAINT "focus_sessions_task_id_users_id_fk" FOREIGN KEY ("task_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
