import { UserAccessTokenInterface } from '../users/UserAccessTokenInterface';
import { UserInterface } from '../users/UserInterface';

export interface AuthInterface {
  user: UserInterface;
  userAccessToken: UserAccessTokenInterface;
}
