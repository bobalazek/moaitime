import {
  and,
  asc,
  count,
  DBQueryConfig,
  desc,
  eq,
  gt,
  gte,
  inArray,
  isNull,
  lt,
  lte,
  ne,
  or,
  SQL,
} from 'drizzle-orm';

import {
  getDatabase,
  NewUserNotification,
  User,
  UserNotification,
  userNotifications,
} from '@moaitime/database-core';
import { globalEventsNotifier } from '@moaitime/global-events-notifier';
import {
  Entity,
  GlobalEventsEnum,
  SortDirectionEnum,
  UserNotificationSchema,
  UserNotification as UserNotificationStripped, // We strip out things like `data` and `relatedEntities` from the UserNotification type
  UserNotificationTypeEnum,
  UserNotificationTypeMessages,
} from '@moaitime/shared-common';

import { contentParser } from '../core/ContentParser';
import { entityManager } from '../core/EntityManager';
import { usersManager } from './UsersManager';

export type UserNotificationsManagerFindOptions = {
  from?: string;
  to?: string;
  nextCursor?: string;
  previousCursor?: string;
  limit?: number;
  sortDirection?: SortDirectionEnum;
  unreadOnly?: boolean;
};

export class UserNotificationsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<UserNotification[]> {
    return getDatabase().query.userNotifications.findMany(options);
  }

  async findOneById(userNotificationId: string): Promise<UserNotification | null> {
    const row = await getDatabase().query.userNotifications.findFirst({
      where: eq(userNotifications.id, userNotificationId),
    });

    return row ?? null;
  }

  async findManyByUserIdWithDataAndMeta(
    userId: string,
    options?: UserNotificationsManagerFindOptions
  ): Promise<{
    data: UserNotificationStripped[];
    meta: {
      previousCursor?: string;
      nextCursor?: string;
      sortDirection?: SortDirectionEnum;
      limit?: number;
    };
  }> {
    const limit = options?.limit ?? 20;
    const sortDirection = options?.sortDirection ?? SortDirectionEnum.DESC;
    const isSortAscending = sortDirection === SortDirectionEnum.ASC;

    let orderWasReversed = false;
    let orderBy = isSortAscending
      ? asc(userNotifications.createdAt)
      : desc(userNotifications.createdAt);
    let where = and(eq(userNotifications.userId, userId), isNull(userNotifications.deletedAt));

    if (options?.from && options?.to) {
      where = and(
        where,
        gte(userNotifications.createdAt, new Date(options.from)),
        lte(userNotifications.createdAt, new Date(options.to))
      ) as SQL<unknown>;
    } else if (options?.from) {
      where = and(where, gte(userNotifications.createdAt, new Date(options.from))) as SQL<unknown>;
    } else if (options?.to) {
      where = and(where, lte(userNotifications.createdAt, new Date(options.to))) as SQL<unknown>;
    }

    if (options?.unreadOnly) {
      where = and(where, isNull(userNotifications.readAt)) as SQL<unknown>;
    }

    if (options?.previousCursor) {
      const { id: previousId, createdAt: previousCreatedAt } = this._cursorToProperties(
        options.previousCursor
      );

      const previosCreatedAtDate = new Date(previousCreatedAt);

      where = and(
        where,
        or(
          isSortAscending
            ? lt(userNotifications.createdAt, previosCreatedAtDate)
            : gt(userNotifications.createdAt, previosCreatedAtDate),
          and(
            eq(userNotifications.createdAt, previosCreatedAtDate),
            ne(userNotifications.id, previousId)
          )
        )
      ) as SQL<unknown>;

      // If we are going backwards, we need to reverse the order so we do not miss any entries in the middle
      orderBy = isSortAscending
        ? desc(userNotifications.createdAt)
        : asc(userNotifications.createdAt);
      orderWasReversed = true;
    }

    if (options?.nextCursor) {
      const { id: nextId, createdAt: nextCreatedAt } = this._cursorToProperties(options.nextCursor);

      const nextCreatedAtDate = new Date(nextCreatedAt);

      where = and(
        where,
        or(
          isSortAscending
            ? gt(userNotifications.createdAt, nextCreatedAtDate)
            : lt(userNotifications.createdAt, nextCreatedAtDate),
          and(eq(userNotifications.createdAt, nextCreatedAtDate), ne(userNotifications.id, nextId))
        )
      ) as SQL<unknown>;
    }

    const rows = await getDatabase().query.userNotifications.findMany({
      where,
      orderBy,
      limit,
    });

    // Here we reverse the order back to what it was originally
    if (orderWasReversed) {
      rows.reverse();
    }

    const user = await usersManager.findOneById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const data = await this._parseRows(user, rows);

    let previousCursor: string | undefined;
    let nextCursor: string | undefined;
    if (data.length > 0) {
      const isLessThanLimit = data.length < limit;
      const firstItem = data[0];
      const lastItem = data[data.length - 1];

      previousCursor = !isLessThanLimit
        ? this._propertiesToCursor({
            id: firstItem.id,
            createdAt: firstItem.createdAt,
          })
        : undefined;
      nextCursor = !isLessThanLimit
        ? this._propertiesToCursor({
            id: lastItem.id,
            createdAt: lastItem.createdAt,
          })
        : undefined;
    }

    if (!options?.previousCursor) {
      // Since no previousCursor was provided by the request,
      // we assume that this is the very first page, and because of that,
      // we certainly have no previous entries.
      previousCursor = undefined;
    }

    const unseenIds = data.filter((item) => !item.seenAt).map((item) => item.id);
    if (unseenIds.length > 0) {
      const now = new Date();
      await getDatabase()
        .update(userNotifications)
        .set({ seenAt: now })
        .where(inArray(userNotifications.id, unseenIds))
        .execute();
    }

    return {
      data,
      meta: {
        previousCursor,
        nextCursor,
        sortDirection,
        limit,
      },
    };
  }

  async insertOne(data: NewUserNotification): Promise<UserNotification> {
    const rows = await getDatabase().insert(userNotifications).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewUserNotification>): Promise<UserNotification> {
    const rows = await getDatabase()
      .update(userNotifications)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userNotifications.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<UserNotification> {
    const rows = await getDatabase()
      .delete(userNotifications)
      .where(eq(userNotifications.id, id))
      .returning();

    return rows[0];
  }

  // Permissions
  async userCanView(userId: string, userNotificationId: string): Promise<boolean> {
    const row = await getDatabase().query.userNotifications.findFirst({
      where: and(
        eq(userNotifications.id, userNotificationId),
        eq(userNotifications.userId, userId)
      ),
    });

    return !!row;
  }

  async userCanUpdate(userId: string, userNotificationId: string): Promise<boolean> {
    return this.userCanView(userId, userNotificationId);
  }

  async userCanDelete(userId: string, userNotificationId: string): Promise<boolean> {
    return this.userCanUpdate(userId, userNotificationId);
  }

  // API Helpers
  async list(actorUserId: string, options?: UserNotificationsManagerFindOptions) {
    return this.findManyByUserIdWithDataAndMeta(actorUserId, options);
  }

  async markAllAsRead(actorUserId: string) {
    const rows = await getDatabase()
      .update(userNotifications)
      .set({ readAt: new Date() })
      .where(and(eq(userNotifications.userId, actorUserId), isNull(userNotifications.deletedAt)))
      .returning();

    globalEventsNotifier.publish(
      GlobalEventsEnum.NOTIFICATIONS_USER_NOTIFICATION_MARKED_ALL_AS_READ,
      {
        actorUserId,
      }
    );

    return rows;
  }

  async view(actorUserId: string, userNotificationId: string) {
    const canView = await this.userCanView(actorUserId, userNotificationId);
    if (!canView) {
      throw new Error('User cannot view this user notification');
    }

    const row = await this.findOneById(userNotificationId);
    if (!row) {
      throw new Error('User notification not found');
    }

    const user = await usersManager.findOneById(actorUserId);
    if (!user) {
      throw new Error('User not found');
    }

    const processedRows = await this._parseRows(user, [row]);
    if (processedRows.length === 0) {
      throw new Error('User notification not found');
    }

    return processedRows[0];
  }

  async delete(actorUserId: string, userNotificationId: string) {
    const canDelete = await this.userCanDelete(actorUserId, userNotificationId);
    if (!canDelete) {
      throw new Error('User cannot delete this user notification');
    }

    const data = await this.updateOneById(userNotificationId, {
      deletedAt: new Date(),
    });

    globalEventsNotifier.publish(GlobalEventsEnum.NOTIFICATIONS_USER_NOTIFICATION_DELETED, {
      actorUserId,
      userNotificationId,
    });

    return data;
  }

  async markAsRead(actorUserId: string, userNotificationId: string) {
    const canUpdate = await this.userCanUpdate(actorUserId, userNotificationId);
    if (!canUpdate) {
      throw new Error('User cannot update this user notification');
    }

    const data = await this.updateOneById(userNotificationId, {
      readAt: new Date(),
    });

    globalEventsNotifier.publish(GlobalEventsEnum.NOTIFICATIONS_USER_NOTIFICATION_MARKED_AS_READ, {
      actorUserId,
      userNotificationId,
    });

    return data;
  }

  async markAsUnread(actorUserId: string, userNotificationId: string) {
    const canUpdate = await this.userCanUpdate(actorUserId, userNotificationId);
    if (!canUpdate) {
      throw new Error('User cannot update this user notification');
    }

    const data = await this.updateOneById(userNotificationId, {
      readAt: null,
    });

    globalEventsNotifier.publish(
      GlobalEventsEnum.NOTIFICATIONS_USER_NOTIFICATION_MARKED_AS_UNREAD,
      {
        actorUserId,
        userNotificationId,
      }
    );

    return data;
  }

  // Helpers
  async countUnseenByUserId(userId: string): Promise<number> {
    const result = await getDatabase()
      .select({
        count: count(userNotifications.id).mapWith(Number),
      })
      .from(userNotifications)
      .where(
        and(
          eq(userNotifications.userId, userId),
          isNull(userNotifications.seenAt),
          isNull(userNotifications.deletedAt)
        )
      )
      .execute();

    return result[0].count ?? 0;
  }

  async countUnreadByUserId(userId: string): Promise<number> {
    const result = await getDatabase()
      .select({
        count: count(userNotifications.id).mapWith(Number),
      })
      .from(userNotifications)
      .where(
        and(
          eq(userNotifications.userId, userId),
          isNull(userNotifications.readAt),
          isNull(userNotifications.deletedAt)
        )
      )
      .execute();

    return result[0].count ?? 0;
  }

  async addNotification(data: {
    type: UserNotificationTypeEnum;
    userId: string;
    targetEntity?: Entity;
    relatedEntities?: Entity[];
    data?: Record<string, unknown>;
  }) {
    const userNotification = await this.insertOne(data);

    globalEventsNotifier.publish(GlobalEventsEnum.NOTIFICATIONS_USER_NOTIFICATION_ADDED, {
      actorUserId: data.userId,
      userNotificationId: userNotification.id,
    });

    return userNotification;
  }

  // Private
  private async _parseRows(user: User, rows: UserNotification[]) {
    const parsedRows: UserNotificationStripped[] = [];

    const objectsMap = await entityManager.getObjectsMap(rows);

    for (const row of rows) {
      const content = UserNotificationTypeMessages[row.type as UserNotificationTypeEnum];
      const variables = (
        row.data && typeof row.data === 'object' && 'variables' in row.data
          ? row.data.variables
          : {}
      ) as Record<string, unknown>;
      const parsedContent = contentParser.parse(content, variables, objectsMap);

      let link = null;
      if (row.type === UserNotificationTypeEnum.USER_FOLLOW_REQUEST_RECEIVED) {
        link = `/social/users/${user.username}/follow-requests`;
      } else if (row.type === UserNotificationTypeEnum.USER_FOLLOW_REQUEST_APPROVED) {
        const targetUser = row.targetEntity
          ? objectsMap.get(`${row.targetEntity.type}:${row.targetEntity.id}`)
          : null;
        if (targetUser) {
          link = `/social/users/${targetUser.username}`;
        }
      } else if (row.type === UserNotificationTypeEnum.USER_ASSIGNED_TO_TASK) {
        const targetTask = row.targetEntity
          ? objectsMap.get(`${row.targetEntity.type}:${row.targetEntity.id}`)
          : null;
        if (targetTask) {
          link = `/?taskId=${targetTask.id}${targetTask.listId ? `&listId=${targetTask.listId}` : ''}`;
        }
      } else if (row.type === UserNotificationTypeEnum.USER_ACHIEVEMENT_RECEIVED) {
        link = `/social/users/${user.username}`;
      }

      const parsedRow = UserNotificationSchema.parse({
        ...row,
        content: parsedContent,
        link,
      });

      parsedRows.push(parsedRow);
    }

    return parsedRows;
  }

  private _propertiesToCursor(properties: { id: string; createdAt: string }): string {
    return btoa(JSON.stringify(properties));
  }

  private _cursorToProperties(cursor: string): { id: string; createdAt: string } {
    return JSON.parse(atob(cursor));
  }
}

export const userNotificationsManager = new UserNotificationsManager();
