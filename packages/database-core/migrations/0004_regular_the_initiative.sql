CREATE TABLE IF NOT EXISTS "user_identities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_key" text NOT NULL,
	"provider_id" text NOT NULL,
	"data" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_identities_user_id_provider_key_idx" ON "user_identities" ("user_id","provider_key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_identities_provider_key_provider_id_idx" ON "user_identities" ("provider_key","provider_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_identities_identity_key_idx" ON "user_identities" ("provider_key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_identities_provider_id_idx" ON "user_identities" ("provider_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_identities_user_id_idx" ON "user_identities" ("user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_identities" ADD CONSTRAINT "user_identities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
