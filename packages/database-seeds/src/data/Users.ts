import { NewUser } from '@moaitime/database-core';
import { generateHash } from '@moaitime/shared-backend';
import { UserSettings } from '@moaitime/shared-common';

import { UserRoleEnum } from '../../../shared-common/src';

export const getUserSeeds = async (): Promise<NewUser[]> => {
  return [
    {
      username: 'admin',
      email: 'admin@moaitime.com',
      password: await generateHash('password'),
      displayName: 'Admin',
      roles: [UserRoleEnum.ADMIN],
      emailConfirmedAt: new Date(),
      settings: {
        generalTimezone: 'Europe/Berlin',
        generalStartDayOfWeek: 1,
      } as UserSettings,
    },
    {
      username: 'moai',
      email: 'moai@moaitime.com',
      password: await generateHash('password'),
      displayName: 'Moai',
      roles: [UserRoleEnum.ADMIN],
      emailConfirmedAt: new Date(),
      settings: {
        generalTimezone: 'Europe/Berlin',
        generalStartDayOfWeek: 1,
      } as UserSettings,
    },
  ];
};
