import { relations } from 'drizzle-orm';
import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import {
  Entity,
  PostStatusTypeEnum,
  PostTypeEnum,
  PostVisibilityEnum,
} from '@moaitime/shared-common';

import { users } from './users';

export const posts = pgTable(
  'posts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    type: text('type').notNull().$type<PostTypeEnum>(),
    subType: text('sub_type').$type<PostStatusTypeEnum | null>(),
    visibility: text('visibility').notNull().$type<PostVisibilityEnum>(),
    content: text('content'),
    relatedEntities: jsonb('related_entities').$type<Entity[]>(), // Those are the entities we will get from the DB before rendering the content
    data: jsonb('data'),
    deletedAt: timestamp('deleted_at'),
    publishedAt: timestamp('published_at').defaultNow(),
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
      userIdIdx: index('posts_user_id_idx').on(table.userId),
    };
  }
);

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));

export type Post = typeof posts.$inferSelect;

export type NewPost = typeof posts.$inferInsert;
