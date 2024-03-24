import crypto from 'crypto';

import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { getEnv } from '@moaitime/shared-backend';

import { AuthenticatedGuard } from '../../features/auth/guards/authenticated.guard';

@Controller('/api/v1/websocket')
export class WebsocketController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async index(@Req() req: Request) {
    const websocketToken = crypto.randomBytes(32).toString('hex');

    const host = req.headers.host ?? `localhost:${getEnv().API_PORT}`;
    const protocol = req.headers['x-forwarded-proto'] ?? req.protocol;
    const url = new URL(`${protocol === 'https' ? 'wss' : 'ws'}:${host}/ws`);
    url.searchParams.append('userAccessToken', req.user?._accessToken.token);
    url.searchParams.append('websocketToken', websocketToken);

    const websocketUrl = url.toString();

    return {
      data: {
        websocketUrl,
      },
    };
  }
}
