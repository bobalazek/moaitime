ALTER TABLE "notes" ADD COLUMN "team_id" uuid;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notes_team_id_idx" ON "notes" ("team_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notes" ADD CONSTRAINT "notes_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
