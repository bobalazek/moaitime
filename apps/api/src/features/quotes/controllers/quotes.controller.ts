import { Controller, Get } from '@nestjs/common';

import { Quote } from '@myzenbuddy/database-core';
import { quotesManager } from '@myzenbuddy/database-services';

import { AbstractResponseDto } from '../../core/dtos/abstract-response.dto';

@Controller('/api/v1/quotes')
export class QuotesController {
  @Get()
  async index(): Promise<AbstractResponseDto<Quote[]>> {
    const data = await quotesManager.findMany();

    return {
      success: true,
      data,
    };
  }
}
