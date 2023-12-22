import { relations } from 'drizzle-orm';
import { index, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

import { calendars } from './calendars';
import { users } from './users';

export const userCalendars = pgTable(
  'user_calendars',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    calendarId: uuid('calendar_id')
      .notNull()
      .references(() => calendars.id),
  },
  (table) => {
    return {
      userIdIdx: index('user_id_idx').on(table.userId),
      calendarIdIdx: index('calendar_id_idx').on(table.calendarId),
    };
  }
);

export const userCalendarsRelations = relations(userCalendars, ({ many }) => ({
  user: many(users),
  calendars: many(calendars),
}));

export type UserCalendar = typeof userCalendars.$inferSelect;

export type NewUserCalendar = typeof userCalendars.$inferInsert;