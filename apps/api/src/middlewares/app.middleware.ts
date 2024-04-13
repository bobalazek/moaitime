import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { getEnv } from '@moaitime/shared-backend';
import { APP_VERSION, APP_VERSION_HEADER } from '@moaitime/shared-common';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  async use(_: Request, res: Response, next: NextFunction) {
    const { GIT_COMMIT_HASH } = getEnv();
    const appVersion = GIT_COMMIT_HASH ? `${APP_VERSION}-${GIT_COMMIT_HASH}` : APP_VERSION;

    res.setHeader('Access-Control-Expose-Headers', APP_VERSION_HEADER);
    res.setHeader(APP_VERSION_HEADER, appVersion);

    next();
  }
}
