import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

import { APP_VERSION, WS_URL } from '@moaitime/shared-common';

@Controller('/api/v1/config')
export class ConfigController {
  @Get()
  async index(@Req() req: Request) {
    const url = new URL(WS_URL);
    url.searchParams.append('userAccessToken', req.user?._accessToken.token);
    const websocketUrl = url.toString();

    return {
      config: {
        version: APP_VERSION,
        websocketUrl,
      },
    };
  }
}
