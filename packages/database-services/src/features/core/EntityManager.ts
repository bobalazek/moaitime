import { inArray } from 'drizzle-orm';

import { getDatabase, tasks, users } from '@moaitime/database-core';
import { Achievements, Entity } from '@moaitime/shared-common';

export class EntityManager {
  async getObjectsMap(rows: { relatedEntities?: Entity[] | null }[]) {
    const relatedEntitiesMap = new Map<string, Entity[]>();
    for (const row of rows) {
      if (!row.relatedEntities) {
        continue;
      }

      for (const relatedEntity of row.relatedEntities) {
        const { id, type } = relatedEntity;
        if (!relatedEntitiesMap.has(type)) {
          relatedEntitiesMap.set(type, []);
        }

        const entities = relatedEntitiesMap.get(type) ?? [];

        entities.push({
          id,
          type,
        });

        relatedEntitiesMap.set(type, entities);
      }
    }

    const objectsMap = new Map<string, Record<string, unknown>>();
    for (const [entityType, entityObjects] of relatedEntitiesMap) {
      const entityIds = entityObjects.map((entity) => entity.id);
      const entityRows: { id: string }[] = [];

      if (entityType === 'achievements') {
        for (const achievement of Achievements) {
          if (entityIds.includes(achievement.key)) {
            entityRows.push({
              id: achievement.key,
              ...achievement,
            });
          }
        }
      } else if (entityType === 'users') {
        entityRows.push(
          ...(await getDatabase().query.users.findMany({
            columns: {
              id: true,
              displayName: true,
              email: true,
              username: true,
            },
            where: inArray(users.id, entityIds),
          }))
        );
      } else if (entityType === 'tasks') {
        entityRows.push(
          ...(await getDatabase().query.tasks.findMany({
            columns: {
              id: true,
              name: true,
              listId: true,
            },
            where: inArray(tasks.id, entityIds),
          }))
        );
      }

      for (const entityRow of entityRows) {
        objectsMap.set(`${entityType}:${entityRow.id}`, entityRow);
      }
    }

    return objectsMap;
  }
}

export const entityManager = new EntityManager();
