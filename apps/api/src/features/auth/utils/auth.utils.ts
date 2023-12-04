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

  return {
    user: {
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      newEmail: user.newEmail ?? null,
      roles: user.roles,
      birthDate: user.birthDate,
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
