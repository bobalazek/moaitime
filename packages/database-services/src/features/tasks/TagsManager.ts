import { and, count, DBQueryConfig, desc, eq, inArray, isNull, or, SQL } from 'drizzle-orm';

import { getDatabase, NewTag, Tag, tags, User } from '@moaitime/database-core';
import { globalEventsNotifier } from '@moaitime/global-events-notifier';
import { CreateTag, GlobalEventsEnum, UpdateTag } from '@moaitime/shared-common';

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
  async list(actorUserId: string, includeDeleted?: boolean) {
    return this.findManyByUserId(actorUserId, {
      includeDeleted,
    });
  }

  async view(actorUserId: string, tagId: string) {
    const canView = await this.userCanView(actorUserId, tagId);
    if (!canView) {
      throw new Error('You cannot view this tag');
    }

    const data = await this.findOneByIdAndUserId(tagId, actorUserId);
    if (!data) {
      throw new Error('Tag not found');
    }

    return data;
  }

  async create(actorUser: User, data: CreateTag) {
    if (!data.teamId) {
      await this._checkIfLimitReached(actorUser);
    }

    if (data.teamId) {
      const teamIds = await usersManager.getTeamIds(actorUser.id);
      if (!teamIds.includes(data.teamId)) {
        throw new Error('You cannot create a tag for this team');
      }
    }

    const tag = await this.insertOne({ ...data, userId: actorUser.id });

    globalEventsNotifier.publish(GlobalEventsEnum.TAGS_TAG_ADDED, {
      actorUserId: actorUser.id,
      tagId: tag.id,
    });

    return tag;
  }

  async update(actorUserId: string, tagId: string, data: UpdateTag) {
    const canUpdate = await this.userCanUpdate(actorUserId, tagId);
    if (!canUpdate) {
      throw new Error('You cannot update this tag');
    }

    const updatedTag = await this.updateOneById(tagId, data);

    globalEventsNotifier.publish(GlobalEventsEnum.TAGS_TAG_EDITED, {
      actorUserId,
      tagId: updatedTag.id,
    });

    return updatedTag;
  }

  async delete(actorUserId: string, tagId: string, isHardDelete?: boolean) {
    const canDelete = await tagsManager.userCanDelete(actorUserId, tagId);
    if (!canDelete) {
      throw new Error('You cannot delete this tag');
    }

    const deletedTag = isHardDelete
      ? await this.deleteOneById(tagId)
      : await this.updateOneById(tagId, {
          deletedAt: new Date(),
        });

    globalEventsNotifier.publish(GlobalEventsEnum.TAGS_TAG_DELETED, {
      actorUserId,
      tagId: deletedTag.id,
    });

    return deletedTag;
  }

  async undelete(actorUser: User, tagId: string) {
    const canDelete = await tagsManager.userCanUpdate(actorUser.id, tagId);
    if (!canDelete) {
      throw new Error('You cannot undelete this tag');
    }

    const tag = await this.findOneById(tagId);
    if (!tag) {
      throw new Error('Tag not found');
    }

    if (!tag.teamId) {
      await this._checkIfLimitReached(actorUser);
    }

    const undeletedTag = await this.updateOneById(tagId, {
      deletedAt: null,
    });

    globalEventsNotifier.publish(GlobalEventsEnum.TAGS_TAG_UNDELETED, {
      actorUserId: actorUser.id,
      tagId: undeletedTag.id,
    });

    return undeletedTag;
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

  // Private
  private async _checkIfLimitReached(actorUser: User) {
    const maxCount = await usersManager.getUserLimit(actorUser, 'listsMaxPerUserCount');
    const currentCount = await this.countByUserId(actorUser.id);
    if (currentCount >= maxCount) {
      throw new Error(`You have reached the maximum number of tags per user (${maxCount}).`);
    }
  }
}

export const tagsManager = new TagsManager();
