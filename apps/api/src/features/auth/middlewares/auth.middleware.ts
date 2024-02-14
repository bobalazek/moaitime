import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { authManager, userActivityEntriesManager, usersManager } from '@moaitime/database-services';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, _: Response, next: NextFunction) {
    let accessToken: string | null = null;
    if (req.headers['authorization']) {
      if (typeof req.headers['authorization'] === 'string') {
        accessToken = req.headers['authorization'];
      } else if (
        Array.isArray(req.headers['authorization']) &&
        typeof req.headers['authorization'][0] === 'string'
      ) {
        accessToken = req.headers['authorization'][0];
      }

      if (accessToken) {
        accessToken = accessToken.toLowerCase().replace('bearer ', '');
      }
    }

    try {
      const userWithAccessToken = accessToken
        ? await authManager.getUserByAccessToken(accessToken)
        : null;
      if (userWithAccessToken) {
        const { user, userAccessToken } = userWithAccessToken;

        req.user = {
          ...user,
          settings: usersManager.getUserSettings(user),
          _accessToken: userAccessToken,
          _plan: null,
          _subscription: null,
        };
      }
    } catch (error) {
      // Nothing to do
    }

    try {
      if (req.user) {
        // No async, because we want to continue the request even if this fails and as soon as possible!
        userActivityEntriesManager.updateUserLastActiveAtById(req.user.id);
      }
    } catch (error) {
      // Nothing to do
    }

    next();
  }
}
