CREATE TABLE IF NOT EXISTS "backgrounds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"image_url" text NOT NULL,
	"author" text,
	"query" text,
	"url" text,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "calendars" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"color" text,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid,
	"team_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"color" text,
	"timezone" text DEFAULT 'UTC',
	"end_timezone" text,
	"is_all_day" boolean DEFAULT false NOT NULL,
	"repeat_pattern" text,
	"repeat_ends_at" timestamp,
	"starts_at" timestamp,
	"ends_at" timestamp,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid,
	"calendar_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "feedback_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "focus_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"task_text" text NOT NULL,
	"settings" jsonb NOT NULL,
	"events" jsonb,
	"stage" text DEFAULT 'focus' NOT NULL,
	"stage_iteration" integer DEFAULT 1 NOT NULL,
	"stage_progress_seconds" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp,
	"last_pinged_at" timestamp,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL,
	"task_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "greetings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"text" text NOT NULL,
	"query" text,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "interests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid,
	"parent_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"order" integer DEFAULT 0,
	"color" text,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid,
	"team_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mood_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"happiness_score" integer,
	"note" text,
	"emotions" jsonb DEFAULT '[]',
	"logged_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text DEFAULT 'note' NOT NULL,
	"title" text NOT NULL,
	"content" jsonb NOT NULL,
	"color" text,
	"directory" text,
	"journal_date" date,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roles" jsonb DEFAULT '[]' NOT NULL,
	"invite_email" text,
	"invited_at" timestamp DEFAULT now(),
	"invite_expires_at" timestamp,
	"invite_accepted_at" timestamp,
	"invite_rejected_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"organization_id" uuid NOT NULL,
	"user_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_key" text NOT NULL,
	"plan_metadata" jsonb,
	"cancel_reason" text,
	"canceled_at" timestamp,
	"started_at" timestamp DEFAULT now(),
	"ends_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"organization_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"text" text NOT NULL,
	"author" text,
	"query" text,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"color" text,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL,
	"team_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"order" integer DEFAULT 0,
	"color" text,
	"priority" integer,
	"duration_seconds" integer,
	"due_date" date,
	"due_date_time" time,
	"due_date_time_zone" text,
	"due_date_repeat_pattern" text,
	"due_date_repeat_ends_at" timestamp,
	"completed_at" timestamp,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL,
	"list_id" uuid,
	"parent_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"task_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"task_id" uuid NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"sub_type" text,
	"visibility" text NOT NULL,
	"content" text,
	"related_entities" jsonb,
	"data" jsonb,
	"deleted_at" timestamp,
	"published_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid,
	"organization_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roles" jsonb DEFAULT '[]' NOT NULL,
	"display_name" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"team_id" uuid NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team_user_invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roles" jsonb DEFAULT '[]' NOT NULL,
	"email" text,
	"token" text NOT NULL,
	"expires_at" timestamp,
	"accepted_at" timestamp,
	"rejected_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"team_id" uuid NOT NULL,
	"user_id" uuid,
	"invited_by_user_id" uuid,
	CONSTRAINT "team_user_invitations_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "testing_emails" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"data" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"target_entity" jsonb NOT NULL,
	"data" jsonb,
	"tags" jsonb DEFAULT '[]',
	"acknowledged_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_access_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" text NOT NULL,
	"user_agent" text,
	"user_agent_parsed" jsonb,
	"device_uid" text,
	"ip" text,
	"revoked_reason" text,
	"refresh_token" text NOT NULL,
	"refresh_token_claimed_at" timestamp,
	"revoked_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL,
	CONSTRAINT "user_access_tokens_token_unique" UNIQUE("token"),
	CONSTRAINT "user_access_tokens_refresh_token_unique" UNIQUE("refresh_token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_data_exports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"processing_status" text DEFAULT 'pending' NOT NULL,
	"failed_error" jsonb,
	"export_url" text,
	"started_at" timestamp,
	"completed_at" timestamp,
	"failed_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_calendars" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"color" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL,
	"calendar_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"target_entity" jsonb,
	"related_entities" jsonb,
	"data" jsonb,
	"seen_at" timestamp,
	"read_at" timestamp,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"achievement_key" text NOT NULL,
	"points" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_achievement_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"points" integer NOT NULL,
	"data" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_achievement_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_experience_points" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"amount" integer NOT NULL,
	"related_entities" jsonb,
	"data" jsonb,
	"invalidated_reason" text,
	"invalidated_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_followed_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"approved_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL,
	"followed_user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_blocked_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"color" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL,
	"blocked_user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_online_activity_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"last_active_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_name" text NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"new_email" text,
	"before_deletion_email" text,
	"password" text,
	"roles" jsonb DEFAULT '["user"]' NOT NULL,
	"settings" jsonb,
	"birth_date" date,
	"biography" text,
	"is_private" boolean DEFAULT false,
	"avatar_image_url" text,
	"email_confirmation_token" text,
	"new_email_confirmation_token" text,
	"password_reset_token" text,
	"deletion_token" text,
	"locked_reason" text,
	"email_confirmed_at" timestamp,
	"email_confirmation_last_sent_at" timestamp,
	"new_email_confirmation_last_sent_at" timestamp,
	"password_reset_last_requested_at" timestamp,
	"locked_at" timestamp,
	"locked_until_at" timestamp,
	"deletion_requested_at" timestamp,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_new_email_unique" UNIQUE("new_email"),
	CONSTRAINT "users_email_confirmation_token_unique" UNIQUE("email_confirmation_token"),
	CONSTRAINT "users_new_email_confirmation_token_unique" UNIQUE("new_email_confirmation_token"),
	CONSTRAINT "users_password_reset_token_unique" UNIQUE("password_reset_token"),
	CONSTRAINT "users_deletion_token_unique" UNIQUE("deletion_token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text,
	"token" text NOT NULL,
	"expires_at" timestamp,
	"claimed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid,
	"claimed_user_id" uuid,
	CONSTRAINT "invitations_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "backgrounds_user_id_idx" ON "backgrounds" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "calendars_user_id_idx" ON "calendars" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "calendars_team_id_idx" ON "calendars" ("team_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_user_id_idx" ON "events" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "events_calendar_id_idx" ON "events" ("calendar_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "feedback_entries_user_id_idx" ON "feedback_entries" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "focus_sessions_user_id_idx" ON "focus_sessions" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "greetings_user_id_idx" ON "greetings" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "interests_user_id_idx" ON "interests" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "interests_parent_id_idx" ON "interests" ("parent_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "lists_user_id_idx" ON "lists" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "lists_team_id_idx" ON "lists" ("team_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mood_entries_user_id_idx" ON "mood_entries" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notes_user_id_idx" ON "notes" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organizations_user_id_idx" ON "organizations" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organization_users_organization_id_idx" ON "organization_users" ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organization_users_user_id_idx" ON "organization_users" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subscriptions_user_id_idx" ON "subscriptions" ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "quotes_user_id_idx" ON "quotes" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tags_user_id_idx" ON "tags" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tags_team_id_idx" ON "tags" ("team_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tasks_user_id_idx" ON "tasks" ("list_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tasks_list_id_idx" ON "tasks" ("list_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tasks_parent_id_idx" ON "tasks" ("parent_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "task_tags_task_id_idx" ON "task_tags" ("task_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "task_tags_tag_id_idx" ON "task_tags" ("tag_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "task_users_task_id_idx" ON "task_users" ("task_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "task_users_user_id_idx" ON "task_users" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "posts_user_id_idx" ON "posts" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "teams_user_id_idx" ON "teams" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "teams_organization_id_idx" ON "teams" ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team_users_team_id_idx" ON "team_users" ("team_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team_users_user_id_idx" ON "team_users" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team_user_invitations_email_idx" ON "team_user_invitations" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team_user_invitations_token_idx" ON "team_user_invitations" ("token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team_user_invitations_team_id_idx" ON "team_user_invitations" ("team_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team_user_invitations_user_id_idx" ON "team_user_invitations" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team_user_invitations_invite_by_user_id_idx" ON "team_user_invitations" ("invited_by_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reports_user_id_idx" ON "reports" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_access_tokens_user_id_idx" ON "user_access_tokens" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_data_exports_user_id_idx" ON "user_data_exports" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_calendars_user_id_idx" ON "user_calendars" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_calendars_calendar_id_idx" ON "user_calendars" ("calendar_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_notifications_user_id_idx" ON "user_notifications" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_achievements_achievement_key_idx" ON "user_achievements" ("achievement_key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_achievements_user_id_idx" ON "user_achievements" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_achievement_entries_key_idx" ON "user_achievement_entries" ("key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_achievement_entries_user_achievement_id_idx" ON "user_achievement_entries" ("user_achievement_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_experience_points_type_idx" ON "user_experience_points" ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_experience_points_user_id_idx" ON "user_experience_points" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_followed_users_user_id_idx" ON "user_followed_users" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_followed_users_followed_user_id_idx" ON "user_followed_users" ("followed_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_blocked_users_user_id_idx" ON "user_blocked_users" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_block_users_blocked_user_id_idx" ON "user_blocked_users" ("blocked_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_online_activity_entries_user_id_idx" ON "user_online_activity_entries" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_username_idx" ON "users" ("username");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_new_email_idx" ON "users" ("new_email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_email_confirmation_token_idx" ON "users" ("email_confirmation_token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_new_email_confirmation_token_idx" ON "users" ("new_email_confirmation_token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_password_reset_token_idx" ON "users" ("password_reset_token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invitations_email_idx" ON "invitations" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invitations_token_idx" ON "invitations" ("token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invitations_user_id_idx" ON "invitations" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invitations_claimed_user_id_idx" ON "invitations" ("claimed_user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "backgrounds" ADD CONSTRAINT "backgrounds_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendars" ADD CONSTRAINT "calendars_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendars" ADD CONSTRAINT "calendars_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_calendar_id_calendars_id_fk" FOREIGN KEY ("calendar_id") REFERENCES "calendars"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback_entries" ADD CONSTRAINT "feedback_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "focus_sessions" ADD CONSTRAINT "focus_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "focus_sessions" ADD CONSTRAINT "focus_sessions_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "greetings" ADD CONSTRAINT "greetings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "interests" ADD CONSTRAINT "interests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lists" ADD CONSTRAINT "lists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lists" ADD CONSTRAINT "lists_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mood_entries" ADD CONSTRAINT "mood_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organizations" ADD CONSTRAINT "organizations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_users" ADD CONSTRAINT "organization_users_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_users" ADD CONSTRAINT "organization_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quotes" ADD CONSTRAINT "quotes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags" ADD CONSTRAINT "tags_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_list_id_lists_id_fk" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task_tags" ADD CONSTRAINT "task_tags_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task_tags" ADD CONSTRAINT "task_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task_users" ADD CONSTRAINT "task_users_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task_users" ADD CONSTRAINT "task_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_users" ADD CONSTRAINT "team_users_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_users" ADD CONSTRAINT "team_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_user_invitations" ADD CONSTRAINT "team_user_invitations_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_user_invitations" ADD CONSTRAINT "team_user_invitations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_user_invitations" ADD CONSTRAINT "team_user_invitations_invited_by_user_id_users_id_fk" FOREIGN KEY ("invited_by_user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_access_tokens" ADD CONSTRAINT "user_access_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_data_exports" ADD CONSTRAINT "user_data_exports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_calendars" ADD CONSTRAINT "user_calendars_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_calendars" ADD CONSTRAINT "user_calendars_calendar_id_calendars_id_fk" FOREIGN KEY ("calendar_id") REFERENCES "calendars"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_notifications" ADD CONSTRAINT "user_notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_achievement_entries" ADD CONSTRAINT "user_achievement_entries_user_achievement_id_user_achievements_id_fk" FOREIGN KEY ("user_achievement_id") REFERENCES "user_achievements"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_experience_points" ADD CONSTRAINT "user_experience_points_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_followed_users" ADD CONSTRAINT "user_followed_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_followed_users" ADD CONSTRAINT "user_followed_users_followed_user_id_users_id_fk" FOREIGN KEY ("followed_user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_blocked_users" ADD CONSTRAINT "user_blocked_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_blocked_users" ADD CONSTRAINT "user_blocked_users_blocked_user_id_users_id_fk" FOREIGN KEY ("blocked_user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_online_activity_entries" ADD CONSTRAINT "user_online_activity_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invitations" ADD CONSTRAINT "invitations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invitations" ADD CONSTRAINT "invitations_claimed_user_id_users_id_fk" FOREIGN KEY ("claimed_user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
