CREATE TABLE IF NOT EXISTS "sharing_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"permissions" jsonb DEFAULT '[]' NOT NULL,
	"subject_type" text NOT NULL,
	"subject_id" uuid NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sharing_entries_subject_type_subject_id_idx" ON "sharing_entries" ("subject_type","subject_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sharing_entries_resource_type_resource_id_idx" ON "sharing_entries" ("resource_type","resource_id");