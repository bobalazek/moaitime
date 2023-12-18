import { NewUser } from '@moaitime/database-core';
import { generateHash } from '@moaitime/shared-backend';
import { UserSettings } from '@moaitime/shared-common';

import { UserRoleEnum } from '../../../shared-common/src';

export const getUserFixtures = async (): Promise<NewUser[]> => {
  return [
    {
      email: 'tester@corcosoft.com',
      password: await generateHash('password'),
      displayName: 'Tester',
      roles: [UserRoleEnum.USER],
      emailConfirmedAt: new Date(),
      settings: {
        generalTimezone: 'Europe/Ljubljana',
        generalStartDayOfWeek: 1,
      } as UserSettings,
    },
    {
      email: 'tester+nonverified@corcosoft.com',
      password: await generateHash('password'),
      roles: [UserRoleEnum.USER],
      displayName: 'NonVerifiedTester',
      settings: {
        generalTimezone: 'Europe/Ljubljana',
        generalStartDayOfWeek: 1,
      } as UserSettings,
    },
  ];
};
