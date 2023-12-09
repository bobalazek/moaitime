import { eq } from 'drizzle-orm';

import { getDatabaseClient, NewList, users } from '@myzenbuddy/database-core';

import { TASK_LIST_COLORS } from '../../../shared-common/src';
import { getUserSeeds } from './Users';

export const getListSeeds = async (): Promise<NewList[]> => {
  const lists: NewList[] = [];

  const userSeeds = await getUserSeeds();
  for (const single of userSeeds) {
    const user = await getDatabaseClient().query.users.findFirst({
      where: eq(users.email, single.email),
    });
    if (!user) {
      throw new Error(`User "${single.email}" not found!`);
    }

    const listNames = ['Inbox', 'Errands', 'Work', 'Personal'];
    for (let i = 0; i < listNames.length; i++) {
      const name = listNames[i];
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
