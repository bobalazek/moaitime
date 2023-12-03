import { eq } from 'drizzle-orm';

import { databaseClient, NewCalendar, users } from '@myzenbuddy/database-core';

export const getCalendarSeeds = async (): Promise<NewCalendar[]> => {
  const userBorut = await databaseClient.query.users.findFirst({
    where: eq(users.email, 'bobalazek124@gmail.com'),
  });
  const userAna = await databaseClient.query.users.findFirst({
    where: eq(users.email, 'anakociper124@gmail.com'),
  });

  return [
    {
      name: "Borut's Calendar",
      timezone: 'Europe/Ljubljana',
      userId: userBorut?.id,
    },
    {
      name: "Ana's Calendar",
      timezone: 'Europe/Ljubljana',
      userId: userAna?.id,
    },
  ];
};
