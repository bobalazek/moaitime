import { inArray } from 'drizzle-orm';

import { users } from '@moaitime/database-core';
import {
  FeedEntry,
  PostStatusTypeEnum,
  PostStatusTypeMessages,
  PublicUserSchema,
  SortDirectionEnum,
} from '@moaitime/shared-common';

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
      const content =
        PostStatusTypeMessages[post.subType as PostStatusTypeEnum] ??
        `Unknown content. Please do ping us about this mistake and provide us with the following post ID: ${post.id}`;

      return {
        ...post,
        content,
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
