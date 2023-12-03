import { eq } from 'drizzle-orm';

import { databaseClient, NewCalendar, users } from '@myzenbuddy/database-core';

export const getCalendarFixtures = async (): Promise<NewCalendar[]> => {
  const userTester = await databaseClient.query.users.findFirst({
    where: eq(users.email, 'tester@corcosoft.com'),
  });

  return [
    {
      name: "Tester's Calendar",
      timezone: 'Europe/Ljubljana',
      userId: userTester?.id,
    },
  ];
};
