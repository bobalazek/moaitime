import { relations } from 'drizzle-orm';
import { index, json, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { OrganizationUserRoleEnum } from '@myzenbuddy/shared-common';

import { organizations } from './organizations';
import { users } from './users';

export const organizationUsers = pgTable(
  'organization_users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    roles: json('roles').notNull().default('[]').$type<OrganizationUserRoleEnum[]>(),
    invitedAt: timestamp('invited_at').defaultNow(),
    inviteExpiresAt: timestamp('invite_expires_at'),
    inviteAcceptedAt: timestamp('invite_accepted_at'),
    inviteRejectedAt: timestamp('invite_rejected_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
  },
  (table) => {
    return {
      organizationIdIdx: index('organization_id_idx').on(table.organizationId),
      userIdIdx: index('user_id_idx').on(table.userId),
    };
  }
);

export const organizationUsersRelations = relations(organizationUsers, ({ many }) => ({
  organization: many(organizations),
  user: many(users),
}));

export type OrganizationUser = typeof organizationUsers.$inferSelect;

export type NewOrganizationUser = typeof organizationUsers.$inferInsert;

export const selectOrganizationUserSchema = createSelectSchema(organizationUsers);

export const insertOrganizationUserSchema = createInsertSchema(organizationUsers);

export const updateOrgamizationUserSchema = insertOrganizationUserSchema.partial();
