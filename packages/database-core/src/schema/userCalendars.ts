import { relations } from 'drizzle-orm';
import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { calendars } from './calendars';
import { users } from './users';

export const userCalendars = pgTable(
  'user_calendars',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    color: text('color'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
    calendarId: uuid('calendar_id')
      .notNull()
      .references(() => calendars.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => {
    return {
      userIdIdx: index('user_calendars_user_id_idx').on(table.userId),
      calendarIdIdx: index('user_calendars_calendar_id_idx').on(table.calendarId),
    };
  }
);

export const userCalendarsRelations = relations(userCalendars, ({ one }) => ({
  user: one(users, {
    fields: [userCalendars.userId],
    references: [users.id],
  }),
  calendar: one(calendars, {
    fields: [userCalendars.calendarId],
    references: [calendars.id],
  }),
}));

export type UserCalendar = typeof userCalendars.$inferSelect;

export type NewUserCalendar = typeof userCalendars.$inferInsert;
