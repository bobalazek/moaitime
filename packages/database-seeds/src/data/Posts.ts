import { eq } from 'drizzle-orm';

import { getDatabase, NewPost, users } from '@moaitime/database-core';
import {
  EntityTypeEnum,
  PostStatusTypeEnum,
  PostTypeEnum,
  PostVisibilityEnum,
} from '@moaitime/shared-common';

import { getUserSeeds } from './Users';

export const getPostSeeds = async (): Promise<NewPost[]> => {
  const posts: NewPost[] = [];

  const userSeeds = await getUserSeeds();
  for (const single of userSeeds) {
    const user = await getDatabase().query.users.findFirst({
      where: eq(users.email, single.email),
    });
    if (!user) {
      throw new Error(`User "${single.email}" not found!`);
    }

    posts.push({
      userId: user.id,
      type: PostTypeEnum.STATUS,
      subType: PostStatusTypeEnum.USER_CREATED,
      visibility: PostVisibilityEnum.PUBLIC,
      data: {
        variables: {
          user: {
            id: user.id,
            displayName: user.displayName,
            __entityType: EntityTypeEnum.USER,
          },
        },
      },
      relatedEntities: [
        {
          id: user.id,
          type: EntityTypeEnum.USER,
        },
      ],
    });
  }

  return posts;
};
