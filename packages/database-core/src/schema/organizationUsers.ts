import { relations } from 'drizzle-orm';
import { index, json, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { OrganizationUserRoleEnum } from '@moaitime/shared-common';

import { organizations } from './organizations';
import { users } from './users';

export const organizationUsers = pgTable(
  'organization_users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    roles: json('roles').notNull().default('[]').$type<OrganizationUserRoleEnum[]>(),
    inviteEmail: text('invite_email'),
    invitedAt: timestamp('invited_at').defaultNow(),
    inviteExpiresAt: timestamp('invite_expires_at'),
    inviteAcceptedAt: timestamp('invite_accepted_at'),
    inviteRejectedAt: timestamp('invite_rejected_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      organizationIdIdx: index('organization_users_organization_id_idx').on(table.organizationId),
      userIdIdx: index('organization_users_user_id_idx').on(table.userId),
    };
  }
);

export const organizationUsersRelations = relations(organizationUsers, ({ many }) => ({
  organization: many(organizations),
  user: many(users),
}));

export type OrganizationUser = typeof organizationUsers.$inferSelect;

export type NewOrganizationUser = typeof organizationUsers.$inferInsert;
