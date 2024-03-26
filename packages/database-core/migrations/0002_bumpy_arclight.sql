ALTER TABLE "notes" ADD COLUMN "parent_id" uuid;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notes_parent_id_idx" ON "notes" ("parent_id");