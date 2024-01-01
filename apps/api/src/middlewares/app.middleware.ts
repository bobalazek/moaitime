import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { APP_VERSION } from '@moaitime/shared-common';

import { APP_VERSION_HEADER } from '../app.constants';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  async use(_: Request, res: Response, next: NextFunction) {
    res.setHeader('Access-Control-Expose-Headers', APP_VERSION_HEADER);
    res.setHeader(APP_VERSION_HEADER, APP_VERSION);

    next();
  }
}
