ALTER TABLE "user_passwordless_login_codes" RENAME TO "user_passwordless_logins";--> statement-breakpoint
ALTER TABLE "user_passwordless_logins" DROP CONSTRAINT "user_passwordless_login_codes_token_unique";--> statement-breakpoint
ALTER TABLE "user_passwordless_logins" DROP CONSTRAINT "user_passwordless_login_codes_user_id_users_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "user_passwordless_login_codes_user_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "user_passwordless_login_codes_token_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_passwordless_logins_user_id_idx" ON "user_passwordless_logins" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_passwordless_logins_token_idx" ON "user_passwordless_logins" ("user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_passwordless_logins" ADD CONSTRAINT "user_passwordless_logins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user_passwordless_logins" ADD CONSTRAINT "user_passwordless_logins_token_unique" UNIQUE("token");