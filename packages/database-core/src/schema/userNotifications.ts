import { relations } from 'drizzle-orm';
import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { Entity, UserNotificationTypeEnum } from '@moaitime/shared-common';

import { users } from './users';

export const userNotifications = pgTable(
  'user_notifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    type: text('type').notNull().$type<UserNotificationTypeEnum>(),
    content: text('content').notNull(),
    targetEntity: jsonb('target_entity').$type<Entity>(),
    relatedEntities: jsonb('related_entities').$type<Entity[]>(), // Those are the entities we will get from the DB before rendering the content
    data: jsonb('data'),
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
