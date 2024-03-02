import { inArray } from 'drizzle-orm';

import { users } from '@moaitime/database-core';
import { FeedEntry, PublicUserSchema, SortDirectionEnum } from '@moaitime/shared-common';

import { usersManager } from '../auth/UsersManager';
import { postsManager, PostsManagerFindOptions } from './PostsManager';

export class FeedManager {
  async list(
    userId: string,
    userIdOrUsername?: string,
    options?: PostsManagerFindOptions
  ): Promise<{
    data: FeedEntry[];
    meta: {
      previousCursor?: string;
      nextCursor?: string;
      sortDirection?: SortDirectionEnum;
      limit?: number;
    };
  }> {
    const result = await postsManager.list(userId, userIdOrUsername, options);

    const usersSet = new Set<string>();
    for (const post of result.data) {
      usersSet.add(post.userId);
    }

    const publicUsers =
      usersSet.size > 0
        ? await usersManager.findMany({
            where: inArray(users.id, Array.from(usersSet)),
          })
        : [];
    const publicUsersMap = new Map(publicUsers.map((user) => [user.id, user]));

    const data = result.data.map((post) => {
      const user = publicUsersMap.get(post.userId);
      const parsedUser = PublicUserSchema.parse(user);

      return {
        ...post,
        user: parsedUser,
        deletedAt: post.deletedAt?.toISOString() ?? null,
        publishedAt: post.publishedAt!.toISOString(),
        createdAt: post.createdAt!.toISOString(),
        updatedAt: post.updatedAt!.toISOString(),
      };
    });
    const meta = result.meta;

    return { data, meta };
  }
}

export const feedManager = new FeedManager();
