ALTER TABLE "tasks" ALTER COLUMN "order" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "order" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "calendars" ADD COLUMN "color" text;--> statement-breakpoint
ALTER TABLE "lists" ADD COLUMN "order" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "color" text;