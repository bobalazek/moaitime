import { relations } from 'drizzle-orm';
import { index, integer, json, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from './users';

export const userExperiencePoints = pgTable(
  'user_experience_points',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    amount: integer('amount').notNull(),
    relatedEntities: json('related_entities').$type<string[]>(), // Those are the entities we will get from the DB before rendering the content
    data: json('data'),
    invalidatedAt: timestamp('invalidated_at'), // In case the user just faked the actions to get the points
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
      userIdIdx: index('user_experience_points_user_id_idx').on(table.userId),
    };
  }
);

export const userExperiencePointsRelations = relations(userExperiencePoints, ({ one }) => ({
  user: one(users, {
    fields: [userExperiencePoints.userId],
    references: [users.id],
  }),
}));

export type UserExperiencePoint = typeof userExperiencePoints.$inferSelect;

export type NewUserExperiencePoint = typeof userExperiencePoints.$inferInsert;