import { and, eq, inArray } from 'drizzle-orm';

import { getDatabase, sharingEntries, SharingEntry } from '@moaitime/database-core';
import {
  EntityTypeEnum,
  SharingPermissionEnum,
  SharingSubjectTypeEnum,
} from '@moaitime/shared-common';

export type SharingManagerSubjectEntry = {
  type: SharingSubjectTypeEnum;
  id: string;
  permissions: SharingPermissionEnum[];
};

export class SharingManager {
  // Helpers
  async findEntriesByResource(
    resourceType: EntityTypeEnum,
    resourceId: string
  ): Promise<SharingEntry[]> {
    const rows = await getDatabase().query.sharingEntries.findMany({
      where: and(
        eq(sharingEntries.resourceType, resourceType),
        eq(sharingEntries.resourceId, resourceId)
      ),
    });

    return rows;
  }

  async setSubjectsForResource(
    resourceType: EntityTypeEnum,
    resourceId: string,
    subjectEntries: SharingManagerSubjectEntry[]
  ): Promise<void> {
    const currentEntries = await this.findEntriesByResource(resourceType, resourceId);
    const currentEntriesMap = new Map(currentEntries.map((entry) => [entry.subjectId, entry]));
    const currentEntryPermissionsMap = new Map(
      currentEntries.map((entry) => [`${entry.subjectType}:${entry.subjectId}`, entry.permissions])
    );

    // To Delete
    const toDelete = currentEntries.filter(
      (currentEntry) =>
        !subjectEntries.find((subject) => {
          return (
            subject.id === currentEntry.subjectId &&
            subject.type === currentEntry.subjectType &&
            JSON.stringify(subject.permissions) ===
              JSON.stringify(
                currentEntryPermissionsMap.get(
                  `${currentEntry.subjectType}:${currentEntry.subjectId}`
                )
              )
          );
        })
    );
    if (toDelete.length > 0) {
      const toDeleteIds = [];
      for (const subjectEntry of toDelete) {
        const entry = currentEntriesMap.get(subjectEntry.id);
        if (!entry) {
          continue;
        }

        toDeleteIds.push(entry.id);
      }

      if (toDeleteIds.length > 0) {
        await getDatabase()
          .delete(sharingEntries)
          .where(inArray(sharingEntries.id, toDeleteIds))
          .execute();
      }
    }

    // To Insert
    const toInsert = subjectEntries.filter(
      (subject) =>
        !currentEntries.find((currentEntry) => {
          return (
            currentEntry.subjectId === subject.id &&
            currentEntry.subjectType === subject.type &&
            JSON.stringify(currentEntry.permissions) === JSON.stringify(subject.permissions)
          );
        })
    );
    if (toInsert.length > 0) {
      const insertData = toInsert.map((subject) => ({
        permissions: subject.permissions,
        subjectType: subject.type,
        subjectId: subject.id,
        resourceType,
        resourceId,
      }));

      await getDatabase().insert(sharingEntries).values(insertData).execute();
    }
  }
}

export const sharingManager = new SharingManager();
