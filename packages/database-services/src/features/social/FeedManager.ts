import { FeedEntry, SortDirectionEnum } from '@moaitime/shared-common';

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

    const data = result.data.map((post) => {
      return {
        ...post,
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
