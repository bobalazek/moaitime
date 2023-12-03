import { NewUser } from '@myzenbuddy/database-core';
import { generateHash } from '@myzenbuddy/shared-backend';

export const getUserSeeds = async (): Promise<NewUser[]> => {
  return [
    {
      email: 'bobalazek124@gmail.com',
      password: await generateHash('password'),
      displayName: 'Borut',
      emailConfirmedAt: new Date(),
    },
    {
      email: 'anakociper124@gmail.com',
      password: await generateHash('password'),
      displayName: 'Ana',
      emailConfirmedAt: new Date(),
    },
  ];
};
