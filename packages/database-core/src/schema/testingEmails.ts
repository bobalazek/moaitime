import { jsonb, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

export type TestingEmailData = {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
};

export const testingEmails = pgTable('testing_emails', {
  id: uuid('id').defaultRandom().primaryKey(),
  data: jsonb('data').$type<TestingEmailData>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type TestingEmail = typeof testingEmails.$inferSelect;

export type NewTestingEmail = typeof testingEmails.$inferInsert;
