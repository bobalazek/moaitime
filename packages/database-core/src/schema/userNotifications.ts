import { relations } from 'drizzle-orm';
import { index, json, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from './users';

export const userNotifications = pgTable(
  'user_notifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    type: text('type').notNull(),
    content: text('content').notNull(),
    data: json('data'),
    seenAt: timestamp('seen_at'),
    readAt: timestamp('read_at'),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => {
    return {
      userIdIdx: index('user_notifications_user_id_idx').on(table.userId),
    };
  }
);

export const userNotificationsRelations = relations(userNotifications, ({ one }) => ({
  user: one(users, {
    fields: [userNotifications.userId],
    references: [users.id],
  }),
}));

export type UserNotification = typeof userNotifications.$inferSelect;

export type NewUserNotification = typeof userNotifications.$inferInsert;
