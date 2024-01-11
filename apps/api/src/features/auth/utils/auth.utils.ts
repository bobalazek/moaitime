import { User, UserAccessToken } from '@moaitime/database-core';
import { usersManager } from '@moaitime/database-services';

import { UserAccessTokenLiteDto } from '../dtos/user-access-token-lite.dto';
import { UserDto } from '../dtos/user.dto';

export const convertToUserAndAccessTokenDto = (
  user: User,
  userAccessToken: UserAccessToken
): {
  user: UserDto;
  userAccessToken: UserAccessTokenLiteDto;
  subscription: null;
} => {
  const now = new Date();

  return {
    user: {
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      newEmail: user.newEmail ?? null,
      roles: user.roles,
      settings: usersManager.getUserSettings(user),
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
    subscription: null,
  };
};
