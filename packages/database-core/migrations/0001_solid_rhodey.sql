ALTER TABLE "tasks" RENAME COLUMN "due_at" TO "due_date";--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "due_date" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "due_date_time" time;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "due_date_time_zone" text;