import { format } from 'date-fns';

import { User, UserAccessToken } from '@myzenbuddy/database-core';
import { authManager } from '@myzenbuddy/database-services';

import { UserAccessTokenLiteDto } from '../dtos/user-access-token-lite.dto';
import { UserDto } from '../dtos/user.dto';

export const convertToUserAndAccessTokenDto = (
  user: User,
  userAccessToken: UserAccessToken
): {
  user: UserDto;
  userAccessToken: UserAccessTokenLiteDto;
} => {
  const now = new Date();

  return {
    user: {
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      newEmail: user.newEmail ?? null,
      roles: user.roles,
      settings: authManager.getUserSettings(user),
      birthDate: user.birthDate,
      emailConfirmedAt: user.emailConfirmedAt?.toISOString() ?? null,
      createdAt: user.createdAt?.toISOString() ?? now.toISOString(),
      updatedAt: user.updatedAt?.toISOString() ?? now.toISOString(),
    },
    userAccessToken: {
      token: userAccessToken.token,
      refreshToken: userAccessToken.refreshToken,
      expiresAt: userAccessToken.expiresAt?.toISOString() ?? null,
    },
  };
};
