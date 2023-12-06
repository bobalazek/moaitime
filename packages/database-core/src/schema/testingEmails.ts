import { json, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export type TestingEmailData = {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
};

export const testingEmails = pgTable('testing_emails', {
  id: uuid('id').defaultRandom().primaryKey(),
  data: json('data').$type<TestingEmailData>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type TestingEmail = typeof testingEmails.$inferSelect;

export type NewTestingEmail = typeof testingEmails.$inferInsert;

export const selectTestingEmailSchema = createSelectSchema(testingEmails);

export const insertTestingEmailSchema = createInsertSchema(testingEmails);

export const updateTestingEmailSchema = insertTestingEmailSchema.partial();
