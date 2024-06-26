import { eq } from 'drizzle-orm';

import { getDatabase, NewList, users } from '@moaitime/database-core';
import { LISTS_DEFAULT_NAMES } from '@moaitime/shared-backend';
import { MAIN_COLORS } from '@moaitime/shared-common';

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
