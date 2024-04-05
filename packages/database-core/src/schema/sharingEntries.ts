import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import {
  EntityTypeEnum,
  SharingPermissionEnum,
  SharingSubjectTypeEnum,
} from '@moaitime/shared-common';

export const sharingEntries = pgTable(
  'sharing_entries',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    permissions: jsonb('permissions').notNull().default('[]').$type<SharingPermissionEnum[]>(),
    // Who is the subject to get those permissions?
    subjectType: text('subject_type').$type<SharingSubjectTypeEnum>().notNull(),
    subjectId: uuid('subject_id').notNull(),
    // What is the resource that the subject is getting permissions for?
    resourceType: text('resource_type').$type<EntityTypeEnum>().notNull(),
    resourceId: uuid('resource_id').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => {
    return {
      subjectTypeSubjectIdIdx: index('sharing_entries_subject_type_subject_id_idx').on(
        table.subjectType,
        table.subjectId
      ),
      resourceTypeResourceIdIdx: index('sharing_entries_resource_type_resource_id_idx').on(
        table.resourceType,
        table.resourceId
      ),
    };
  }
);

export type SharingEntry = typeof sharingEntries.$inferSelect;

export type NewSharingEntry = typeof sharingEntries.$inferInsert;
