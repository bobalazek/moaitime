import crypto from 'crypto';

import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

import { WS_URL } from '@moaitime/shared-common';

@Controller('/api/v1/websocket')
export class WebsocketController {
  @Get()
  async index(@Req() req: Request) {
    const websocketToken = crypto.randomBytes(32).toString('hex');

    const url = new URL(WS_URL);
    url.searchParams.append('userAccessToken', req.user?._accessToken.token);
    url.searchParams.append('websocketToken', websocketToken);

    const websocketUrl = url.toString();

    return {
      data: {
        websocketUrl,
        a: 'te',
      },
    };
  }
}
