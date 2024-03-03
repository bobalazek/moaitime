import {
  and,
  asc,
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

import { getDatabase, NewPost, Post, posts, User, users } from '@moaitime/database-core';
import {
  Entity,
  FeedPost,
  PostStatusTypeEnum,
  PostStatusTypeMessages,
  PostTypeEnum,
  PostVisibilityEnum,
  PublicUserSchema,
  SortDirectionEnum,
} from '@moaitime/shared-common';

import { usersManager } from '../auth/UsersManager';
import { contentParser } from '../core/ContentParser';
import { entityManager } from '../core/EntityManager';

export type PostsManagerFindOptions = {
  from?: string;
  to?: string;
  nextCursor?: string;
  previousCursor?: string;
  limit?: number;
  sortDirection?: SortDirectionEnum;
};

export class PostsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<Post[]> {
    return getDatabase().query.posts.findMany(options);
  }

  async findManyByUserIdWithDataAndMeta(
    userId: string,
    userIdOrUsername?: string,
    options?: PostsManagerFindOptions
  ): Promise<{
    data: FeedPost[];
    meta: {
      previousCursor?: string;
      nextCursor?: string;
      sortDirection?: SortDirectionEnum;
      limit?: number;
    };
  }> {
    let user: User | null = null;
    if (userIdOrUsername) {
      user = await usersManager.findOneByIdOrUsername(userIdOrUsername);
      if (!user) {
        throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
      }
    }

    const limit = options?.limit ?? 20;
    const sortDirection = options?.sortDirection ?? SortDirectionEnum.DESC;
    const isSortAscending = sortDirection === SortDirectionEnum.ASC;

    let orderWasReversed = false;
    let orderBy = isSortAscending ? asc(posts.createdAt) : desc(posts.createdAt);
    let where = isNull(posts.deletedAt);

    if (user) {
      where = and(where, eq(posts.userId, user.id)) as SQL<unknown>;
    }

    if (options?.from && options?.to) {
      where = and(
        where,
        gte(posts.createdAt, new Date(options.from)),
        lte(posts.createdAt, new Date(options.to))
      ) as SQL<unknown>;
    } else if (options?.from) {
      where = and(where, gte(posts.createdAt, new Date(options.from))) as SQL<unknown>;
    } else if (options?.to) {
      where = and(where, lte(posts.createdAt, new Date(options.to))) as SQL<unknown>;
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
            ? lt(posts.createdAt, previosCreatedAtDate)
            : gt(posts.createdAt, previosCreatedAtDate),
          and(eq(posts.createdAt, previosCreatedAtDate), ne(posts.id, previousId))
        )
      ) as SQL<unknown>;

      // If we are going backwards, we need to reverse the order so we do not miss any entries in the middle
      orderBy = isSortAscending ? desc(posts.createdAt) : asc(posts.createdAt);
      orderWasReversed = true;
    }

    if (options?.nextCursor) {
      const { id: nextId, createdAt: nextCreatedAt } = this._cursorToProperties(options.nextCursor);

      const nextCreatedAtDate = new Date(nextCreatedAt);

      where = and(
        where,
        or(
          isSortAscending
            ? gt(posts.createdAt, nextCreatedAtDate)
            : lt(posts.createdAt, nextCreatedAtDate),
          and(eq(posts.createdAt, nextCreatedAtDate), ne(posts.id, nextId))
        )
      ) as SQL<unknown>;
    }

    const rows = await getDatabase().query.posts.findMany({
      where,
      orderBy,
      limit,
    });

    // Here we reverse the order back to what it was originally
    if (orderWasReversed) {
      rows.reverse();
    }

    const data = await this._parseRows(userId, rows);

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

  async findOneById(id: string): Promise<Post | null> {
    const row = await getDatabase().query.posts.findFirst({
      where: eq(posts.id, id),
    });

    return row ?? null;
  }

  async insertOne(data: NewPost): Promise<Post> {
    const rows = await getDatabase().insert(posts).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewPost>): Promise<Post> {
    const rows = await getDatabase()
      .update(posts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<Post> {
    const rows = await getDatabase().delete(posts).where(eq(posts.id, id)).returning();

    return rows[0];
  }

  // Helpers
  async addPost(data: {
    userId: string;
    type: PostTypeEnum;
    subType: PostStatusTypeEnum;
    visibility: PostVisibilityEnum;
    content?: string;
    data: Record<string, unknown>;
    relatedEntities: Entity[];
  }) {
    const post = await this.insertOne(data);

    return post;
  }

  // Permissions
  async userCanDelete(actorUserId: string, postOrPostId: string | Post): Promise<boolean> {
    const post =
      typeof postOrPostId === 'string' ? await this.findOneById(postOrPostId) : postOrPostId;
    if (!post) {
      return false;
    }

    if (post.userId !== actorUserId) {
      return false;
    }

    return true;
  }

  // API Helpers
  async list(actorUserId: string, userIdOrUsername?: string, options?: PostsManagerFindOptions) {
    return this.findManyByUserIdWithDataAndMeta(actorUserId, userIdOrUsername, options);
  }

  async delete(actorUserId: string, postId: string) {
    const canDelete = await this.userCanDelete(actorUserId, postId);
    if (!canDelete) {
      throw new Error(`You do not have permission to delete this post.`);
    }

    return this.deleteOneById(postId);
  }

  // Private
  private async _parseRows(actorUserId: string, rows: Post[]) {
    const usersSet = new Set<string>();
    for (const post of rows) {
      usersSet.add(post.userId);
    }

    const publicUsers =
      usersSet.size > 0
        ? await usersManager.findMany({
            where: inArray(users.id, Array.from(usersSet)),
          })
        : [];
    const publicUsersMap = new Map(publicUsers.map((user) => [user.id, user]));
    const objectsMap = await entityManager.getObjectsMap(rows);

    return rows.map((row) => {
      const user = publicUsersMap.get(row.userId);
      const parsedUser = PublicUserSchema.parse(user);
      const rawContent =
        PostStatusTypeMessages[row.subType as PostStatusTypeEnum] ??
        `Unknown content. Please do ping us about this mistake and provide us with the following post ID: ${row.id}`;
      const variables = (
        row.data && typeof row.data === 'object' && 'variables' in row.data
          ? row.data.variables
          : {}
      ) as Record<string, unknown>;
      const content = contentParser.parse(rawContent, variables, objectsMap);

      return {
        ...row,
        content,
        user: parsedUser,
        permissions: {
          canDelete: actorUserId === row.userId,
        },
        deletedAt: row.deletedAt?.toISOString() ?? null,
        publishedAt: row.publishedAt!.toISOString(),
        createdAt: row.createdAt!.toISOString(),
        updatedAt: row.updatedAt!.toISOString(),
      };
    });
  }

  private _propertiesToCursor(properties: { id: string; createdAt: string }): string {
    return btoa(JSON.stringify(properties));
  }

  private _cursorToProperties(cursor: string): { id: string; createdAt: string } {
    return JSON.parse(atob(cursor));
  }
}

export const postsManager = new PostsManager();
