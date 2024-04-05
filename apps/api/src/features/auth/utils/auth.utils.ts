import { usersManager } from '@moaitime/database-services';

import { AuthDto } from '../dtos/auth.dto';
import { UserWithAccessToken } from '../types/user-with-access-token.type';

export const convertUserToAuthDto = (userWithAccessToken: UserWithAccessToken): AuthDto => {
  const now = new Date();

  return {
    user: {
      id: userWithAccessToken.id,
      displayName: userWithAccessToken.displayName,
      username: userWithAccessToken.username,
      email: userWithAccessToken.email,
      newEmail: userWithAccessToken.newEmail ?? null,
      hasPassword: !!userWithAccessToken.password,
      roles: userWithAccessToken.roles,
      settings: usersManager.getUserSettings(userWithAccessToken),
      biography: userWithAccessToken.biography,
      birthDate: userWithAccessToken.birthDate,
      isPrivate: !!userWithAccessToken.isPrivate,
      avatarImageUrl: userWithAccessToken.avatarImageUrl,
      emailConfirmedAt: userWithAccessToken.emailConfirmedAt?.toISOString() ?? null,
      createdAt: userWithAccessToken.createdAt?.toISOString() ?? now.toISOString(),
      updatedAt: userWithAccessToken.updatedAt?.toISOString() ?? now.toISOString(),
      userIdentities:
        userWithAccessToken.userIdentities?.map((identity) => ({
          providerKey: identity.providerKey,
          providerId: identity.providerId,
          data: identity.data,
        })) ?? [],
    },
    userAccessToken: {
      token: userWithAccessToken._accessToken.token,
      refreshToken: userWithAccessToken._accessToken.refreshToken,
      expiresAt: userWithAccessToken._accessToken.expiresAt?.toISOString() ?? null,
    },
    plan: userWithAccessToken._plan ?? null,
    subscription: userWithAccessToken._subscription ?? null,
  };
};
