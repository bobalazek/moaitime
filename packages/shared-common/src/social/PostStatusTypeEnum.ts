import { EntityTypeEnum } from '../core/entities/EntityTypeEnum';

export enum PostStatusTypeEnum {
  USER_CREATED = 'user-created',
}

export const PostStatusTypeMessages: Record<PostStatusTypeEnum, string> = {
  [PostStatusTypeEnum.USER_CREATED]: `**{{user.displayName}}** has joined the platform!`,
};

export type PostStatusTypeVariables = {
  [PostStatusTypeEnum.USER_CREATED]: {
    user: {
      id: string;
      displayName: string;
      __entityType: EntityTypeEnum.USER;
    };
  };
};
