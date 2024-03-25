import { OauthUserInfo } from '@moaitime/shared-common';

export class OauthUserInfoDto implements OauthUserInfo {
  sub!: string;
  email?: string;
  emailVerified?: boolean;
  preferredUsername?: string;
  displayName?: string;
  avatarUrl?: string;
}
