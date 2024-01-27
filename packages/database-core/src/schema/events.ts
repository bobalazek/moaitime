import { relations } from 'drizzle-orm';
import { boolean, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { calendars } from './calendars';
import { users } from './users';

export const events = pgTable(
  'events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    color: text('color'),
    timezone: text('timezone').default('UTC'),
    endTimezone: text('end_timezone'), // In case the endsAt is in a different timezone
    isAllDay: boolean('is_all_day').notNull().default(false),
    repeatPattern: text('repeat_pattern'), // the resulting pattern from rrule
    startsAt: timestamp('starts_at'),
    endsAt: timestamp('ends_at'),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    calendarId: uuid('calendar_id')
      .notNull()
      .references(() => calendars.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      userIdIdx: index('events_user_id_idx').on(table.userId),
      calendarIdIdx: index('events_calendar_id_idx').on(table.calendarId),
    };
  }
);

export const eventsRelations = relations(events, ({ one }) => ({
  calendar: one(calendars, {
    fields: [events.calendarId],
    references: [calendars.id],
  }),
}));

export type Event = typeof events.$inferSelect;

export type NewEvent = typeof events.$inferInsert;
