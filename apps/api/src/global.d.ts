import { APP_VERSION_HEADER } from './app.constants';
import { UserWithAccessToken } from './features/auth/types/user-with-access-token.type';

export {};

declare global {
  namespace Express {
    interface Request {
      // auth.middleware.ts
      // Can not be optional, because then we always need
      // to do !req.user in each and every controller action
      user: UserWithAccessToken;
    }

    interface Response {
      headers?: {
        // app.middleware.ts
        [APP_VERSION_HEADER]: string;
      };
    }
  }
}
