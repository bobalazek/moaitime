import { Post, User } from '@moaitime/database-core';
import {
  EntityTypeEnum,
  PostStatusTypeEnum,
  PostTypeEnum,
  PostVisibilityEnum,
} from '@moaitime/shared-common';

import { PostsManager, postsManager } from './PostsManager';

export class PostStatusSender {
  constructor(private _postsManager: PostsManager) {}

  async sendUserCreatedPost(user: User): Promise<Post> {
    const data = {
      variables: {
        user: {
          id: user.id,
          displayName: user.displayName,
          __entityType: EntityTypeEnum.USERS,
        },
      },
    };

    const relatedEntities = [
      {
        id: user.id,
        type: EntityTypeEnum.USERS,
      },
    ];

    const post = await this._postsManager.addPost({
      userId: user.id,
      type: PostTypeEnum.STATUS,
      subType: PostStatusTypeEnum.USER_CREATED,
      visibility: PostVisibilityEnum.PUBLIC,
      data,
      relatedEntities,
    });

    return post;
  }
}

export const postStatusSender = new PostStatusSender(postsManager);
