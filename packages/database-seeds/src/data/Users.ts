import { NewUser } from '@moaitime/database-core';
import { generateHash } from '@moaitime/shared-backend';
import { UserSettings } from '@moaitime/shared-common';

import { UserRoleEnum } from '../../../shared-common/src';

export const getUserSeeds = async (): Promise<NewUser[]> => {
  return [
    {
      username: 'bobalazek',
      email: 'borut@moaitime.com',
      password: await generateHash('password'),
      displayName: 'Borut',
      roles: [UserRoleEnum.ADMIN],
      emailConfirmedAt: new Date(),
      settings: {
        generalTimezone: 'Europe/Ljubljana',
        generalStartDayOfWeek: 1,
      } as UserSettings,
    },
    {
      username: 'anak',
      email: 'ana@moaitime.com',
      password: await generateHash('password'),
      displayName: 'Ana',
      roles: [UserRoleEnum.ADMIN],
      emailConfirmedAt: new Date(),
      settings: {
        generalTimezone: 'Europe/Ljubljana',
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
        generalTimezone: 'Europe/Ljubljana',
        generalStartDayOfWeek: 1,
      } as UserSettings,
    },
  ];
};
