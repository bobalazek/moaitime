import { OauthToken } from '@moaitime/shared-common';

export class OauthTokenDto implements OauthToken {
  access_token!: string;
  expires_in!: number;
  prompt!: string;
  scope!: string;
  token_type!: string;
}
