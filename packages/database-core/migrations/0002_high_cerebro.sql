CREATE TABLE IF NOT EXISTS "habit_daily_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"goal_amount" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"habit_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "habits" ALTER COLUMN "goal_amount" SET DEFAULT 1;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "habit_daily_entries_habit_id_idx" ON "habit_daily_entries" ("habit_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "habit_daily_entries" ADD CONSTRAINT "habit_daily_entries_habit_id_habits_id_fk" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
