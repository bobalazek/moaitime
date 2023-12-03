import { NewUser } from '@myzenbuddy/database-core';
import { generateHash } from '@myzenbuddy/shared-backend';

export const getUserFixtures = async (): Promise<NewUser[]> => {
  return [
    {
      email: 'tester@corcosoft.com',
      password: await generateHash('password'),
      displayName: 'Tester',
      emailConfirmedAt: new Date(),
    },
    {
      email: 'tester+nonverified@corcosoft.com',
      password: await generateHash('password'),
      displayName: 'NonVerifiedTester',
    },
  ];
};
