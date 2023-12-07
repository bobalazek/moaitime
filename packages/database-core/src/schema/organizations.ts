import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { teams } from './teams';

export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const organizationsRelations = relations(organizations, ({ many }) => ({
  teams: many(teams),
}));

export type Organization = typeof organizations.$inferSelect;

export type NewOrganization = typeof organizations.$inferInsert;

export const selectOrganizationSchema = createSelectSchema(organizations);

export const insertOrganizationSchema = createInsertSchema(organizations);

export const updateOrganizationSchema = insertOrganizationSchema.partial();
