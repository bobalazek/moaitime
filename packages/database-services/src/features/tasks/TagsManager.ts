import { and, count, DBQueryConfig, desc, eq, inArray, isNull, or, SQL } from 'drizzle-orm';

import { getDatabase, NewTag, Tag, tags, User } from '@moaitime/database-core';
import { CreateTag, UpdateTag } from '@moaitime/shared-common';

import { usersManager } from '../auth/UsersManager';

export type TagsManagerFindManyByUserIdOptions = {
  includeDeleted?: boolean;
};

export class TagsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<Tag[]> {
    return getDatabase().query.tags.findMany(options);
  }

  async findManyByUserId(
    userId: string,
    options?: TagsManagerFindManyByUserIdOptions
  ): Promise<Tag[]> {
    let where: SQL<unknown>;

    const teamIds = await usersManager.getTeamIds(userId);
    if (teamIds.length === 0) {
      where = eq(tags.userId, userId);
    } else {
      where = or(eq(tags.userId, userId), inArray(tags.teamId, teamIds)) as SQL<unknown>;
    }

    if (!options?.includeDeleted) {
      where = and(where, isNull(tags.deletedAt)) as SQL<unknown>;
    }

    return getDatabase().query.tags.findMany({
      where,
      orderBy: [desc(tags.teamId), desc(tags.createdAt)],
    });
  }

  async findOneById(tagId: string): Promise<Tag | null> {
    const row = await getDatabase().query.tags.findFirst({
      where: eq(tags.id, tagId),
    });

    return row ?? null;
  }

  async findOneByIdAndUserId(tagId: string, userId: string): Promise<Tag | null> {
    const row = await getDatabase().query.tags.findFirst({
      where: and(eq(tags.id, tagId), eq(tags.userId, userId)),
    });

    return row ?? null;
  }

  async insertOne(data: NewTag): Promise<Tag> {
    const rows = await getDatabase().insert(tags).values(data).returning();

    return rows[0];
  }

  async updateOneById(tagId: string, data: Partial<NewTag>): Promise<Tag> {
    const rows = await getDatabase()
      .update(tags)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tags.id, tagId))
      .returning();

    return rows[0];
  }

  async deleteOneById(tagId: string): Promise<Tag> {
    const rows = await getDatabase().delete(tags).where(eq(tags.id, tagId)).returning();

    return rows[0];
  }

  // Permissions
  async userCanView(userId: string, tagId: string): Promise<boolean> {
    const row = await getDatabase().query.tags.findFirst({
      where: and(eq(tags.id, tagId), eq(tags.userId, userId)),
    });

    return !!row;
  }

  async userCanUpdate(userId: string, tagId: string): Promise<boolean> {
    return this.userCanView(userId, tagId);
  }

  async userCanDelete(userId: string, tagId: string): Promise<boolean> {
    return this.userCanUpdate(userId, tagId);
  }

  // API Helpers
  async list(userId: string, includeDeleted?: boolean) {
    return this.findManyByUserId(userId, {
      includeDeleted,
    });
  }

  async view(userId: string, tagId: string) {
    const canView = await this.userCanView(userId, tagId);
    if (!canView) {
      throw new Error('You cannot view this tag');
    }

    const data = await this.findOneByIdAndUserId(tagId, userId);
    if (!data) {
      throw new Error('Tag not found');
    }

    return data;
  }

  async create(user: User, data: CreateTag) {
    const maxCount = await usersManager.getUserLimit(user, 'listsMaxPerUserCount');
    const currentCount = await this.countByUserId(user.id);
    if (currentCount >= maxCount) {
      throw new Error(`You have reached the maximum number of tags per user (${maxCount}).`);
    }

    if (data.teamId) {
      const teamIds = await usersManager.getTeamIds(user.id);
      if (!teamIds.includes(data.teamId)) {
        throw new Error('You cannot create a tag for this team');
      }
    }

    return this.insertOne({ ...data, userId: user.id });
  }

  async update(userId: string, tagId: string, data: UpdateTag) {
    const canUpdate = await this.userCanUpdate(userId, tagId);
    if (!canUpdate) {
      throw new Error('You cannot update this tag');
    }

    return this.updateOneById(tagId, data);
  }

  async delete(userId: string, tagId: string, isHardDelete?: boolean) {
    const canDelete = await tagsManager.userCanDelete(userId, tagId);
    if (!canDelete) {
      throw new Error('You cannot delete this tag');
    }

    return isHardDelete
      ? this.deleteOneById(tagId)
      : this.updateOneById(tagId, {
          deletedAt: new Date(),
        });
  }

  async undelete(userId: string, tagId: string) {
    const canDelete = await tagsManager.userCanUpdate(userId, tagId);
    if (!canDelete) {
      throw new Error('You cannot undelete this tag');
    }

    return this.updateOneById(tagId, {
      deletedAt: null,
    });
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
}

export const tagsManager = new TagsManager();
