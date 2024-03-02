import { Post } from '@moaitime/database-core';
import { PostStatusTypeEnum, PostTypeEnum, PostVisibilityEnum } from '@moaitime/shared-common';

import { PostsManager, postsManager } from './PostsManager';

export class PostsSender {
  constructor(private _postsManager: PostsManager) {}

  async sendUserCreatedPost(userId: string): Promise<Post> {
    const post = await this._postsManager.createPost(
      userId,
      PostTypeEnum.STATUS,
      PostStatusTypeEnum.USER_CREATED,
      PostVisibilityEnum.PUBLIC
    );

    return post;
  }
}

export const postsSender = new PostsSender(postsManager);
