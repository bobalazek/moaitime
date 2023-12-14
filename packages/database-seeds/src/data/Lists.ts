import { eq } from 'drizzle-orm';

import { getDatabase, NewList, users } from '@moaitime/database-core';
import { LIST_DEFAULT_NAMES } from '@moaitime/shared-backend';
import { TASK_LIST_COLORS } from '@moaitime/shared-common';

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

    for (let i = 0; i < LIST_DEFAULT_NAMES.length; i++) {
      const name = LIST_DEFAULT_NAMES[i];
      const color = TASK_LIST_COLORS[i % TASK_LIST_COLORS.length].value;

      lists.push({
        name,
        userId: user.id,
        color,
      });
    }
  }

  return lists;
};
