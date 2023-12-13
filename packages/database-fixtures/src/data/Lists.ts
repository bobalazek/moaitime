import { getDatabase, NewList, users } from '@moaitime/database-core';
import { DEFAULT_LIST_NAMES } from '@moaitime/shared-backend';
import { TASK_LIST_COLORS } from '@moaitime/shared-common';
import { eq } from 'drizzle-orm';

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

    for (let i = 0; i < DEFAULT_LIST_NAMES.length; i++) {
      const name = DEFAULT_LIST_NAMES[i];
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
