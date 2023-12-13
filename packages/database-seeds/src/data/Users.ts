import { NewUser } from '@moaitime/database-core';
import { generateHash } from '@moaitime/shared-backend';
import { UserSettings } from '@moaitime/shared-common';

import { UserRoleEnum } from '../../../shared-common/src';

export const getUserSeeds = async (): Promise<NewUser[]> => {
  return [
    {
      email: 'bobalazek124@gmail.com',
      password: await generateHash('password'),
      displayName: 'Borut',
      roles: [UserRoleEnum.ADMIN],
      emailConfirmedAt: new Date(),
      settings: {
        generalTimezone: 'Europe/Ljubljana',
      } as UserSettings,
    },
    {
      email: 'anakociper124@gmail.com',
      password: await generateHash('password'),
      displayName: 'Ana',
      roles: [UserRoleEnum.ADMIN],
      emailConfirmedAt: new Date(),
      settings: {
        generalTimezone: 'Europe/Ljubljana',
      } as UserSettings,
    },
  ];
};
