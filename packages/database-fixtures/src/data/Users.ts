import { NewUser } from '@myzenbuddy/database-core';
import { generateHash } from '@myzenbuddy/shared-backend';

import { UserRoleEnum } from '../../../shared-common/src';

export const getUserFixtures = async (): Promise<NewUser[]> => {
  return [
    {
      email: 'tester@corcosoft.com',
      password: await generateHash('password'),
      displayName: 'Tester',
      roles: [UserRoleEnum.USER],
      emailConfirmedAt: new Date(),
    },
    {
      email: 'tester+nonverified@corcosoft.com',
      password: await generateHash('password'),
      roles: [UserRoleEnum.USER],
      displayName: 'NonVerifiedTester',
    },
  ];
};
