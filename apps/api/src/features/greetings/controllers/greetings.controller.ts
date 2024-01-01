import { Controller, Get, UseGuards } from '@nestjs/common';

import { Greeting } from '@moaitime/database-core';
import { greetingsManager } from '@moaitime/database-services';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/greetings')
export class GreetingsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(): Promise<AbstractResponseDto<Greeting[]>> {
    const data = await greetingsManager.findManyRandom();

    return {
      success: true,
      data,
    };
  }
}
