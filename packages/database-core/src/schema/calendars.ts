import { relations } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { events } from './events';
import { users } from './users';

export const calendars = pgTable('calendars', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  color: text('color'),
  timezone: text('timezone').notNull().default('UTC'),
  isPublic: boolean('is_public').notNull().default(false),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
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
