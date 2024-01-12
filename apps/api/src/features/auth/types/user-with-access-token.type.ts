import { User, UserAccessToken } from '@moaitime/database-core';
import { Plan, Subscription } from '@moaitime/shared-common';

export type UserWithAccessToken = User & {
  _accessToken: UserAccessToken;
  _plan?: Plan | null;
  _subscription?: Subscription | null;
};
