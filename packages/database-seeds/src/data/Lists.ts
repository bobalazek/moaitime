import { eq } from 'drizzle-orm';

import { getDatabase, NewList, users } from '@moaitime/database-core';
import { LISTS_DEFAULT_NAMES } from '@moaitime/shared-backend';
import { MAIN_COLORS } from '@moaitime/shared-common';

import { getUserSeeds } from './Users';

export const getListSeeds = async (): Promise<NewList[]> => {
  const lists: NewList[] = [];

  const userSeeds = await getUserSeeds();
  for (const single of userSeeds) {
    const user = await getDatabase().query.users.findFirst({
      where: eq(users.email, single.email),
    });
    if (!user) {
      throw new Error(`User "${single.email}" not found!`);
    }

    for (let i = 0; i < LISTS_DEFAULT_NAMES.length; i++) {
      const name = LISTS_DEFAULT_NAMES[i];
      const color = MAIN_COLORS[i % MAIN_COLORS.length].value;

      lists.push({
        name,
        userId: user.id,
        color,
      });
    }
  }

  return lists;
};
