import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import {
  authManager,
  userOnlineActivityEntriesManager,
  usersManager,
} from '@moaitime/database-services';

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

    const deviceUid = req.get('device-uid');

    const userWithAccessToken = accessToken
      ? await authManager.getUserByAccessToken(accessToken)
      : null;
    if (userWithAccessToken) {
      const { user, userAccessToken } = userWithAccessToken;

      // We absolutely need to make sure to NOT prevent the user from logging out there,
      // otherwise we will get a infinite loop!
      // Must be .baseUrl or .originalUrl, because .url for some reason is always "/"
      if (
        userAccessToken.deviceUid &&
        userAccessToken.deviceUid !== deviceUid &&
        !req.baseUrl.includes('/logout')
      ) {
        await authManager.logout(userAccessToken.token, 'Invalid device UID');

        throw new UnauthorizedException('Invalid device UID. Please log in again.');
      }

      req.user = {
        ...user,
        settings: usersManager.getUserSettings(user),
        _accessToken: userAccessToken,
        _plan: null,
        _subscription: null,
      };
    }

    try {
      if (req.user) {
        // No async, because we want to continue the request even if this fails and as soon as possible!
        userOnlineActivityEntriesManager.updateUserLastActiveAtById(req.user.id);
      }
    } catch (error) {
      // Nothing to do
    }

    next();
  }
}
