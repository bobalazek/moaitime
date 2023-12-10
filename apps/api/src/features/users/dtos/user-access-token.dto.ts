import { UserAccessTokenInterface } from '@myzenbuddy/shared-common';

export class UserAccessTokenDto implements UserAccessTokenInterface {
  token!: string;
  refreshToken!: string;
  expiresAt!: string | null;
  createdAt!: string;
  updatedAt!: string;
}
