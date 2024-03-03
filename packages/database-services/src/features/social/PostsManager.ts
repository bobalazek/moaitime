import { and, DBQueryConfig, desc, eq } from 'drizzle-orm';

import { getDatabase, NewPost, Post, posts, User } from '@moaitime/database-core';
import {
  Entity,
  PostStatusTypeEnum,
  PostTypeEnum,
  PostVisibilityEnum,
  SortDirectionEnum,
} from '@moaitime/shared-common';

import { usersManager } from '../auth/UsersManager';

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

  // API Helpers
  async list(userId: string, userIdOrUsername?: string, options?: PostsManagerFindOptions) {
    let user: User | null = null;
    if (userIdOrUsername) {
      user = await usersManager.findOneByIdOrUsername(userIdOrUsername);
      if (!user) {
        throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
      }
    }

    const limit = options?.limit ?? 20;
    const sortDirection = options?.sortDirection ?? SortDirectionEnum.DESC;

    let previousCursor: string | undefined;
    let nextCursor: string | undefined;

    let where = eq(posts.visibility, PostVisibilityEnum.PUBLIC);
    if (user) {
      where = and(where, eq(posts.userId, user.id))!;
    }

    const data = await this.findMany({
      where,
      orderBy: desc(posts.createdAt),
    });

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
}

export const postsManager = new PostsManager();
