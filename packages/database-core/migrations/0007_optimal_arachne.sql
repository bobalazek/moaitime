CREATE TABLE IF NOT EXISTS "user_passwordless_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text DEFAULT 'email' NOT NULL,
	"token" text NOT NULL,
	"code" text NOT NULL,
	"expires_at" timestamp,
	"accepted_at" timestamp,
	"rejected_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL,
	CONSTRAINT "user_passwordless_codes_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_passwordless_codes_user_id_idx" ON "user_passwordless_codes" ("user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_passwordless_codes" ADD CONSTRAINT "user_passwordless_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
