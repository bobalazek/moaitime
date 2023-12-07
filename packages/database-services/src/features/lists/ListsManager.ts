import { DBQueryConfig, eq } from 'drizzle-orm';

import {
  databaseClient,
  insertListSchema,
  List,
  lists,
  NewList,
  updateListSchema,
} from '@myzenbuddy/database-core';

export class ListsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<List[]> {
    return databaseClient.query.lists.findMany(options);
  }

  async findManyByUserId(userId: string): Promise<List[]> {
    return databaseClient.query.lists.findMany({
      where: eq(lists.userId, userId),
    });
  }

  async findOneById(id: string): Promise<List | null> {
    const row = await databaseClient.query.lists.findFirst({
      where: eq(lists.id, id),
    });

    return row ?? null;
  }

  async insertOne(data: NewList): Promise<List> {
    data = insertListSchema.parse(data) as unknown as List;

    const rows = await databaseClient.insert(lists).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewList>): Promise<List> {
    data = updateListSchema.parse(data) as unknown as NewList;

    const rows = await databaseClient
      .update(lists)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(lists.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<List> {
    const rows = await databaseClient.delete(lists).where(eq(lists.id, id)).returning();

    return rows[0];
  }
}

export const listsManager = new ListsManager();
