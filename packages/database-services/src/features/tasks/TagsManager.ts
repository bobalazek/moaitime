import { and, count, DBQueryConfig, desc, eq, isNull } from 'drizzle-orm';

import { getDatabase, NewTag, Tag, tags } from '@moaitime/database-core';

export class TagsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<Tag[]> {
    return getDatabase().query.tags.findMany(options);
  }

  async findManyByUserId(userId: string): Promise<Tag[]> {
    return getDatabase().query.tags.findMany({
      where: and(eq(tags.userId, userId), isNull(tags.deletedAt)),
      orderBy: desc(tags.createdAt),
    });
  }

  async findOneById(id: string): Promise<Tag | null> {
    const row = await getDatabase().query.tags.findFirst({
      where: eq(tags.id, id),
    });

    return row ?? null;
  }

  async findOneByIdAndUserId(id: string, userId: string): Promise<Tag | null> {
    const row = await getDatabase().query.tags.findFirst({
      where: and(eq(tags.id, id), eq(tags.userId, userId)),
    });

    return row ?? null;
  }

  async insertOne(data: NewTag): Promise<Tag> {
    const rows = await getDatabase().insert(tags).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewTag>): Promise<Tag> {
    const rows = await getDatabase()
      .update(tags)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tags.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<Tag> {
    const rows = await getDatabase().delete(tags).where(eq(tags.id, id)).returning();

    return rows[0];
  }

  // Helpers
  async countByUserId(userId: string): Promise<number> {
    const result = await getDatabase()
      .select({
        count: count(tags.id).mapWith(Number),
      })
      .from(tags)
      .where(and(eq(tags.userId, userId), isNull(tags.deletedAt)))
      .execute();

    return result[0].count ?? 0;
  }

  async userCanView(userId: string, noteId: string): Promise<boolean> {
    const row = await getDatabase().query.tags.findFirst({
      where: and(eq(tags.id, noteId), eq(tags.userId, userId)),
    });

    return row !== null;
  }

  async userCanUpdate(userId: string, noteId: string): Promise<boolean> {
    return this.userCanView(userId, noteId);
  }

  async userCanDelete(userId: string, noteId: string): Promise<boolean> {
    return this.userCanUpdate(userId, noteId);
  }
}

export const tagsManager = new TagsManager();
