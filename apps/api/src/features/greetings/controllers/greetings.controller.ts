import { Greeting } from '@moaitime/database-core';
import { greetingsManager } from '@moaitime/database-services';
import { Controller, Get } from '@nestjs/common';

import { AbstractResponseDto } from '../../core/dtos/responses/abstract-response.dto';

@Controller('/api/v1/greetings')
export class GreetingsController {
  @Get()
  async list(): Promise<AbstractResponseDto<Greeting[]>> {
    const data = await greetingsManager.findMany();

    return {
      success: true,
      data,
    };
  }
}
