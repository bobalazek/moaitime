import { Controller, Get, UseGuards } from '@nestjs/common';

import { Greeting } from '@moaitime/database-core';
import { greetingsManager } from '@moaitime/database-services';

import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { AbstractResponseDto } from '../../core/dtos/responses/abstract-response.dto';

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
