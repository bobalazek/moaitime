import { EntityTypeEnum } from '../core/entities/EntityTypeEnum';

export enum PostStatusTypeEnum {
  USER_CREATED = 'user-created',
}

export const PostStatusTypeMessages: Record<PostStatusTypeEnum, string> = {
  [PostStatusTypeEnum.USER_CREATED]: `**{{requestingUser.displayName}}** has sent you a follow request.`,
};

export type PostStatusTypeVariables = {
  [PostStatusTypeEnum.USER_CREATED]: {
    requestingUser: {
      id: string;
      displayName: string;
      __entityType: EntityTypeEnum.USERS;
    };
  };
};
