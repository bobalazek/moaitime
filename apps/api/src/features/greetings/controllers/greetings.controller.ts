import { Controller, Get } from '@nestjs/common';

import { Greeting } from '@myzenbuddy/database-core';
import { greetingsManager } from '@myzenbuddy/database-services';

import { AbstractResponseDto } from '../../core/dtos/abstract-response.dto';

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
