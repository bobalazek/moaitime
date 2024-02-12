CREATE TABLE IF NOT EXISTS "user_experience_points" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"amount" integer NOT NULL,
	"related_entities" json,
	"data" json,
	"invalidated_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_experience_points_user_id_idx" ON "user_experience_points" ("user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_experience_points" ADD CONSTRAINT "user_experience_points_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
