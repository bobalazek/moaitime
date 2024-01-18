import { relations } from 'drizzle-orm';
import { index, json, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { organizations } from './organizations';

export const subscriptions = pgTable(
  'subscriptions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    planKey: text('plan_key').notNull(),
    planMetadata: json('plan_metadata'), // In case we have some custom arrangement with a customer regarding their plan like custom limits or something
    cancelReason: text('cancel_reason'),
    canceledAt: timestamp('canceled_at'),
    startedAt: timestamp('started_at').defaultNow(),
    endsAt: timestamp('ends_at'), // if null, it's perpetual/lifetime
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      organizationIdIdx: index('lists_user_id_idx').on(table.organizationId),
    };
  }
);

export const subscriptionssRelations = relations(subscriptions, ({ one }) => ({
  organization: one(organizations, {
    fields: [subscriptions.organizationId],
    references: [organizations.id],
  }),
}));

export type Subscription = typeof subscriptions.$inferSelect;

export type NewSubscriptions = typeof subscriptions.$inferInsert;
