import { relations } from 'drizzle-orm';
import { index, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { OauthProviderEnum } from '@moaitime/shared-common';

import { users } from './users';

export const userIdentities = pgTable(
  'user_identities',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    providerKey: text('provider_key').notNull().$type<OauthProviderEnum>(),
    providerId: text('provider_id').notNull(), // Usually the subject ID from the provider
    data: jsonb('data').$type<Record<string, unknown>>(), // Raw data we get from the provider
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
      userIdProviderKeyIdx: uniqueIndex('user_identities_user_id_provider_key_idx').on(
        table.userId,
        table.providerKey
      ),
      providerKeyProviderId: index('user_identities_provider_key_provider_id_idx').on(
        table.providerKey,
        table.providerId
      ),
      providerKeyIdx: index('user_identities_identity_key_idx').on(table.providerKey),
      providerId: index('user_identities_provider_id_idx').on(table.providerId),
      userIdIdx: index('user_identities_user_id_idx').on(table.userId),
    };
  }
);

export const userIdentitiesRelations = relations(userIdentities, ({ one }) => ({
  user: one(users, {
    fields: [userIdentities.userId],
    references: [users.id],
  }),
}));

export type UserIdentity = typeof userIdentities.$inferSelect;

export type NewUserIdentity = typeof userIdentities.$inferInsert;
