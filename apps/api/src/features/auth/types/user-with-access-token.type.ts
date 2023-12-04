import { User, UserAccessToken } from '@myzenbuddy/database-core';

export type UserWithAccessToken = User & {
  _accessToken: UserAccessToken;
};
