import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { Greeting } from '@moaitime/database-core';
import { greetingsManager } from '@moaitime/database-services';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/greetings')
export class GreetingsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<Greeting[]>> {
    const data = await greetingsManager.list(req.user);

    return {
      success: true,
      data,
    };
  }
}
