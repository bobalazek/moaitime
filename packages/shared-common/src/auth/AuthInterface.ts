import { UserAccessTokenInterface } from './UserAccessTokenInterface';
import { UserInterface } from './UserInterface';

export interface AuthInterface {
  user: UserInterface;
  userAccessToken: UserAccessTokenInterface;
}
