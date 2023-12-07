import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { events } from './events';
import { users } from './users';

export const calendars = pgTable('calendars', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  timezone: text('timezone').notNull(),
  isPublic: text('is_public').notNull().default('false'),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  userId: uuid('user_id').references(() => users.id),
});

export const calendarsRelations = relations(calendars, ({ one, many }) => ({
  user: one(users, {
    fields: [calendars.userId],
    references: [users.id],
  }),
  events: many(events),
}));

export type Calendar = typeof calendars.$inferSelect;

export type NewCalendar = typeof calendars.$inferInsert;

export const selectCalendarSchema = createSelectSchema(calendars);

export const insertCalendarSchema = createInsertSchema(calendars);

export const updateCalendarSchema = insertCalendarSchema.partial();
