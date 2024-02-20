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
import {
  Entity,
  SortDirectionEnum,
  UserNotificationSchema,
  UserNotification as UserNotificationStripped, // We strip out things like `data` and `relatedEntities` from the UserNotification type
  UserNotificationTypeEnum,
} from '@moaitime/shared-common';

import { usersManager } from './UsersManager';

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
    const data = await this._parseRows(user!, rows);

    let previousCursor: string | undefined;
    let nextCursor: string | undefined;
    if (data.length > 0) {
      const isLessThanLimit = data.length < (options?.limit ?? 0);
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
  async list(userId: string, options?: UserNotificationsManagerFindOptions) {
    return this.findManyByUserIdWithDataAndMeta(userId, options);
  }

  async delete(userId: string, userNotificationId: string) {
    const canDelete = await this.userCanDelete(userId, userNotificationId);
    if (!canDelete) {
      throw new Error('User cannot delete this user notification');
    }

    return this.updateOneById(userNotificationId, {
      deletedAt: new Date(),
    });
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
    content: string;
    targetEntity?: Entity;
    relatedEntities?: Entity[];
    data?: Record<string, unknown>;
  }) {
    return this.insertOne(data);
  }

  // Private
  private async _parseRows(user: User, rows: UserNotification[]) {
    const parsedRows: UserNotificationStripped[] = [];

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

      if (entityType === 'users') {
        entityRows.push(
          ...(await getDatabase().query.users.findMany({
            columns: {
              id: true,
              displayName: true,
              email: true,
              username: true,
            },
            where: inArray(userNotifications.id, entityIds),
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
            where: inArray(userNotifications.id, entityIds),
          }))
        );
      }

      for (const entityRow of entityRows) {
        objectsMap.set(`${entityType}:${entityRow.id}`, entityRow);
      }
    }

    for (const row of rows) {
      const { content, ...rest } = row;

      const variables = (
        rest.data && typeof rest.data === 'object' && 'variables' in rest.data
          ? rest.data.variables
          : {}
      ) as Record<string, unknown>;
      const parsedContent = this._parseContent(content, variables, objectsMap);

      let link = null;
      if (rest.type === UserNotificationTypeEnum.USER_FOLLOW_REQUEST) {
        link = `/social/users/${user.username}/follow-requests`;
      } else if (rest.type === UserNotificationTypeEnum.USER_FOLLOW_REQUEST_APPROVED) {
        const targetUser = rest.targetEntity
          ? objectsMap.get(`${rest.targetEntity.type}:${rest.targetEntity.id}`)
          : null;
        if (targetUser) {
          link = `/social/users/${targetUser.username}`;
        }
      } else if (rest.type === UserNotificationTypeEnum.USER_ASSIGNED_TO_TASK) {
        const targetTask = rest.targetEntity
          ? objectsMap.get(`${rest.targetEntity.type}:${rest.targetEntity.id}`)
          : null;
        if (targetTask) {
          link = `/?taskId=${targetTask.id}${targetTask.listId ? `&listId=${targetTask.listId}` : ''}`;
        }
      }

      const parsedRow = UserNotificationSchema.parse({
        ...rest,
        content: parsedContent,
        link,
      });

      parsedRows.push(parsedRow);
    }

    return parsedRows;
  }

  private _parseContent(
    content: string,
    variables: Record<string, unknown>,
    objectsMap: Map<string, Record<string, unknown>>
  ) {
    let parsedContent = content;

    const flatVariables = Object.entries(variables).reduce((acc, [key, value]) => {
      if (typeof value === 'object' && value !== null) {
        if ('__entityType' in value && 'id' in value) {
          const entityType = value.__entityType as string;
          const entityId = value.id as string;

          value = {
            ...value,
            ...objectsMap.get(`${entityType}:${entityId}`),
          };
        }

        return {
          ...acc,
          ...Object.entries(value as Record<string, unknown>).reduce((acc2, [key2, value2]) => {
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

    for (const [key, value] of Object.entries(flatVariables)) {
      parsedContent = parsedContent.replace(new RegExp(`{{${key}}}`, 'g'), value as string);
    }

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
