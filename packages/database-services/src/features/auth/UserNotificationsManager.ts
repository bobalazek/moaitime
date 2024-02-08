import {
  and,
  asc,
  count,
  DBQueryConfig,
  desc,
  eq,
  gt,
  gte,
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
  UserNotification,
  userNotifications,
} from '@moaitime/database-core';
import { SortDirectionEnum, UserNotificationTypeEnum } from '@moaitime/shared-common';

export type UserNotificationsManagerFindOptions = {
  from?: string;
  to?: string;
  nextCursor?: string;
  previousCursor?: string;
  limit?: number;
  sortDirection?: SortDirectionEnum;
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
    data: UserNotification[];
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
    let where = eq(userNotifications.userId, userId);

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

    const data = rows.map((row) => {
      return this._parseRow(row);
    });

    let previousCursor: string | undefined;
    let nextCursor: string | undefined;
    if (data.length > 0) {
      const isLessThanLimit = data.length < (options?.limit ?? 0);
      const firstItem = data[0];
      const lastItem = data[data.length - 1];

      previousCursor = !isLessThanLimit
        ? this._propertiesToCursor({
            id: firstItem.id,
            createdAt: firstItem.createdAt!.toISOString(),
          })
        : undefined;
      nextCursor = !isLessThanLimit
        ? this._propertiesToCursor({
            id: lastItem.id,
            createdAt: lastItem.createdAt!.toISOString(),
          })
        : undefined;
    }

    if (!options?.previousCursor) {
      // Since no previousCursor was provided by the request,
      // we assume that this is the very first page, and because of that,
      // we certainly have no previous entries.
      previousCursor = undefined;
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
  async list(userId: string, options?: UserNotificationsManagerFindOptions) {
    return this.findManyByUserIdWithDataAndMeta(userId, options);
  }

  async markAsRead(userId: string, userNotificationId: string) {
    const canUpdate = await this.userCanUpdate(userId, userNotificationId);
    if (!canUpdate) {
      throw new Error('User cannot update this user notification');
    }

    return this.updateOneById(userNotificationId, {
      readAt: new Date(),
    });
  }

  async markAsUnread(userId: string, userNotificationId: string) {
    const canUpdate = await this.userCanUpdate(userId, userNotificationId);
    if (!canUpdate) {
      throw new Error('User cannot update this user notification');
    }

    return this.updateOneById(userNotificationId, {
      readAt: null,
    });
  }

  async markAsSeen(userId: string, userNotificationId: string) {
    const canUpdate = await this.userCanUpdate(userId, userNotificationId);
    if (!canUpdate) {
      throw new Error('User cannot update this user notification');
    }

    return this.updateOneById(userNotificationId, {
      seenAt: new Date(),
    });
  }

  async markAsUnseen(userId: string, userNotificationId: string) {
    const canUpdate = await this.userCanUpdate(userId, userNotificationId);
    if (!canUpdate) {
      throw new Error('User cannot update this user notification');
    }

    return this.updateOneById(userNotificationId, {
      seenAt: null,
    });
  }

  // Helpers
  async countUnseenByUserId(userId: string): Promise<number> {
    const result = await getDatabase()
      .select({
        count: count(userNotifications.id).mapWith(Number),
      })
      .from(userNotifications)
      .where(and(eq(userNotifications.userId, userId), isNull(userNotifications.seenAt)))
      .execute();

    return result[0].count ?? 0;
  }

  async countUnreadByUserId(userId: string): Promise<number> {
    const result = await getDatabase()
      .select({
        count: count(userNotifications.id).mapWith(Number),
      })
      .from(userNotifications)
      .where(and(eq(userNotifications.userId, userId), isNull(userNotifications.readAt)))
      .execute();

    return result[0].count ?? 0;
  }

  async addNotification(data: {
    type: UserNotificationTypeEnum;
    userId: string;
    content: string;
    targetEntity?: string;
    relatedEntities?: string[];
    data?: Record<string, unknown>;
  }) {
    return this.insertOne(data);
  }

  // Private
  private _parseRow(row: UserNotification) {
    const { content, ...rest } = row;

    const variables = (
      rest.data && typeof rest.data === 'object' && 'variables' in rest.data
        ? rest.data.variables
        : {}
    ) as Record<string, unknown>;
    const parsedContent = this._parseContent(content, variables);

    return {
      ...rest,
      content: parsedContent,
    };
  }

  private _parseContent(content: string, variables: Record<string, unknown>) {
    let parsedContent = content;
    const flatVariables = Object.entries(variables).reduce((acc, [key, value]) => {
      if (typeof value === 'object' && value !== null) {
        return {
          ...acc,
          ...Object.entries(value).reduce((acc2, [key2, value2]) => {
            return {
              ...acc2,
              [`${key}.${key2}`]: value2,
            };
          }, {}),
        };
      }

      return {
        ...acc,
        [key]: value,
      };
    }, {});

    Object.entries(flatVariables).forEach(([key, value]) => {
      parsedContent = parsedContent.replace(new RegExp(`{{${key}}}`, 'g'), value as string);
    });

    parsedContent = parsedContent.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    return parsedContent;
  }

  private _propertiesToCursor(properties: { id: string; createdAt: string }): string {
    return btoa(JSON.stringify(properties));
  }

  private _cursorToProperties(cursor: string): { id: string; createdAt: string } {
    return JSON.parse(atob(cursor));
  }
}

export const userNotificationsManager = new UserNotificationsManager();
