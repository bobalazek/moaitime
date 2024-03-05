import { relations } from 'drizzle-orm';
import { index, integer, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { AchievementEnum } from '@moaitime/shared-common';

import { users } from './users';

export const userAchievements = pgTable(
  'user_achievements',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    achievementKey: text('achievement_key').notNull().$type<AchievementEnum>(),
    points: integer('points').notNull(),
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
      userIdAchievementKeyIdx: uniqueIndex('user_achievements_user_id_achievement_key_idx').on(
        table.userId,
        table.achievementKey
      ),
      achievementKeyIdx: index('user_achievements_achievement_key_idx').on(table.achievementKey),
      userIdIdx: index('user_achievements_user_id_idx').on(table.userId),
    };
  }
);

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
}));

export type UserAchievement = typeof userAchievements.$inferSelect;

export type NewUserAchievement = typeof userAchievements.$inferInsert;
