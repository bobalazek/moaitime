CREATE TABLE IF NOT EXISTS "list_teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"list_id" uuid,
	"team_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "list_teams_list_id_idx" ON "list_teams" ("list_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "list_teams_team_id_idx" ON "list_teams" ("team_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "list_teams" ADD CONSTRAINT "list_teams_list_id_lists_id_fk" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "list_teams" ADD CONSTRAINT "list_teams_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
