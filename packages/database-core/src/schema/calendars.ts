import { relations } from 'drizzle-orm';
import { boolean, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { events } from './events';
import { teams } from './teams';
import { users } from './users';

export const calendars = pgTable(
  'calendars',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    color: text('color'),
    timezone: text('timezone').notNull().default('UTC'),
    isPublic: boolean('is_public').notNull().default(false),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    teamId: uuid('team_id').references(() => teams.id, { onDelete: 'set null' }),
  },
  (table) => {
    return {
      userIdIdx: index('calendars_user_id_idx').on(table.userId),
      teamIdIdx: index('calendars_team_id_idx').on(table.teamId),
    };
  }
);

export const calendarsRelations = relations(calendars, ({ one, many }) => ({
  user: one(users, {
    fields: [calendars.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [calendars.teamId],
    references: [teams.id],
  }),
  events: many(events),
}));

export type Calendar = typeof calendars.$inferSelect;

export type NewCalendar = typeof calendars.$inferInsert;
