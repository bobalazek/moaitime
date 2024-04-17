import { usersManager } from '@moaitime/database-services';
import { getEnv } from '@moaitime/shared-backend';

import { AuthDto } from '../dtos/auth.dto';
import { UserWithAccessToken } from '../types/user-with-access-token.type';

export const convertUserToAuthDto = (userWithAccessToken: UserWithAccessToken): AuthDto => {
  const now = new Date();
  const { API_BASE_URL } = getEnv();

  const userAccessToken = {
    token: userWithAccessToken._accessToken.token,
    refreshToken: userWithAccessToken._accessToken.refreshToken,
    expiresAt: userWithAccessToken._accessToken.expiresAt?.toISOString() ?? null,
    deviceUid: userWithAccessToken._accessToken.deviceUid,
  };

  const avatarImageUrlRaw = userWithAccessToken.avatarImageUrl;
  const avatarImageFileName = avatarImageUrlRaw ? avatarImageUrlRaw.split('/').pop() : null;
  const avatarImageUrl = avatarImageFileName
    ? `${API_BASE_URL}/api/v1/users/${userWithAccessToken.id}/avatar/${avatarImageFileName}?access-token=${userAccessToken.token}&device-uid=${userAccessToken.deviceUid}`
    : null;

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
      avatarImageUrl,
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
    userAccessToken,
    plan: userWithAccessToken._plan ?? null,
    subscription: userWithAccessToken._subscription ?? null,
  };
};
