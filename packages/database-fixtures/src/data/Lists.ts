import { eq } from 'drizzle-orm';

import { getDatabase, NewList, users } from '@moaitime/database-core';
import { LIST_DEFAULT_NAMES } from '@moaitime/shared-backend';
import { TASK_LIST_COLORS } from '@moaitime/shared-common';

import { getUserFixtures } from './Users';

export const getListFixtures = async (): Promise<NewList[]> => {
  const lists: NewList[] = [];

  const userFixtures = await getUserFixtures();
  for (const single of userFixtures) {
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
