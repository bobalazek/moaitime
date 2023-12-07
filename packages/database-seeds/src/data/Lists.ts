import { eq } from 'drizzle-orm';

import { databaseClient, NewList, users } from '@myzenbuddy/database-core';

import { TASK_LIST_COLORS } from '../../../shared-common/src';

export const getListSeeds = async (): Promise<NewList[]> => {
  const userBorut = await databaseClient.query.users.findFirst({
    where: eq(users.email, 'bobalazek124@gmail.com'),
  });
  if (!userBorut) {
    throw new Error('User borut not found!');
  }

  const userAna = await databaseClient.query.users.findFirst({
    where: eq(users.email, 'anakociper124@gmail.com'),
  });
  if (!userAna) {
    throw new Error('User ana not found!');
  }

  const lists: NewList[] = [];

  const listNames = ['Inbox', 'Errands', 'Work', 'Personal'];
  for (let i = 0; i < listNames.length; i++) {
    const name = listNames[i];
    const color = TASK_LIST_COLORS[i % TASK_LIST_COLORS.length].value;

    lists.push({
      name,
      userId: userBorut.id,
      color,
    });
    lists.push({
      name,
      userId: userAna.id,
      color,
    });
  }

  return lists;
};
