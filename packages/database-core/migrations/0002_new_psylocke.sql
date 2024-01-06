DO $$ BEGIN
 CREATE TYPE "note_types" AS ENUM('note', 'journal_entry');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "type" "note_types" DEFAULT 'note' NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "journal_date" date;