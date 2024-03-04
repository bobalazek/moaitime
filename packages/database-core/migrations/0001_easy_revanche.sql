ALTER TABLE "habits" ADD COLUMN "goal_amount" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "habits" ADD COLUMN "goal_unit" text DEFAULT 'times' NOT NULL;--> statement-breakpoint
ALTER TABLE "habits" ADD COLUMN "goal_frequency" text DEFAULT 'day' NOT NULL;
