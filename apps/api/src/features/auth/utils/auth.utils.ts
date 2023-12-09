import { format } from 'date-fns';

import { User, UserAccessToken } from '@myzenbuddy/database-core';

import { UserAccessTokenDto } from '../../users/dtos/user-access-token.dto';
import { UserDto } from '../../users/dtos/user.dto';

export const convertToUserAndAccessTokenDto = (
  user: User,
  userAccessToken: UserAccessToken
): {
  user: UserDto;
  userAccessToken: UserAccessTokenDto;
} => {
  const now = new Date();

  let birthDate: string | null = null;

  // TODO: Bug in drizzle: https://github.com/drizzle-team/drizzle-orm/issues/1185. Should actually be a string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (user.birthDate && (user.birthDate as unknown as Date) instanceof Date) {
    birthDate = format(user.birthDate as unknown as Date, 'yyyy-MM-dd');
  } else if (user.birthDate) {
    birthDate = user.birthDate as string;
  }

  return {
    user: {
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      newEmail: user.newEmail ?? null,
      roles: user.roles,
      birthDate,
      emailConfirmedAt: user.emailConfirmedAt?.toISOString() ?? null,
      createdAt: user.createdAt?.toISOString() ?? now.toISOString(),
      updatedAt: user.updatedAt?.toISOString() ?? now.toISOString(),
    },
    userAccessToken: {
      token: userAccessToken.token,
      refreshToken: userAccessToken.refreshToken,
      expiresAt: userAccessToken.expiresAt?.toISOString() ?? null,
      createdAt: userAccessToken.createdAt?.toISOString() ?? now.toISOString(),
      updatedAt: userAccessToken.updatedAt?.toISOString() ?? now.toISOString(),
    },
  };
};
