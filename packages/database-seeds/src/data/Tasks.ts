import { eq } from 'drizzle-orm';

import { getDatabase, lists, NewTask, users } from '@moaitime/database-core';
import { TASKS_DEFAULT_ENTRIES } from '@moaitime/shared-backend';

import { getUserSeeds } from './Users';

export const getTaskSeeds = async (): Promise<NewTask[]> => {
  const tasks: NewTask[] = [];

  const userSeeds = await getUserSeeds();
  for (const single of userSeeds) {
    const user = await getDatabase().query.users.findFirst({
      where: eq(users.email, single.email),
    });
    if (!user) {
      throw new Error(`User "${single.email}" not found!`);
    }

    const userLists = await getDatabase().query.lists.findMany({
      where: eq(lists.userId, user.id),
    });

    for (const list of userLists) {
      const name = list.name as keyof typeof TASKS_DEFAULT_ENTRIES;
      const defaultTasks = TASKS_DEFAULT_ENTRIES[name] ?? [];
      for (let j = 0; j < defaultTasks.length; j++) {
        tasks.push({
          name: defaultTasks[j],
          listId: list.id,
          userId: user.id,
        });
      }
    }
  }

  return tasks;
};
