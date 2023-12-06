import { NewUser } from '@myzenbuddy/database-core';
import { generateHash } from '@myzenbuddy/shared-backend';

import { UserRoleEnum } from '../../../shared-common/src';

export const getUserSeeds = async (): Promise<NewUser[]> => {
  return [
    {
      email: 'bobalazek124@gmail.com',
      password: await generateHash('password'),
      displayName: 'Borut',
      roles: [UserRoleEnum.ADMIN],
      emailConfirmedAt: new Date(),
    },
    {
      email: 'anakociper124@gmail.com',
      password: await generateHash('password'),
      displayName: 'Ana',
      roles: [UserRoleEnum.ADMIN],
      emailConfirmedAt: new Date(),
    },
  ];
};
