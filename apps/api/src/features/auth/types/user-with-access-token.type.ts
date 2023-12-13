import { User, UserAccessToken } from '@moaitime/database-core';

export type UserWithAccessToken = User & {
  _accessToken: UserAccessToken;
};
