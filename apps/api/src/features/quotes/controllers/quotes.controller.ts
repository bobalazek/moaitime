import { Controller, Get, UseGuards } from '@nestjs/common';

import { Quote } from '@moaitime/database-core';
import { quotesManager } from '@moaitime/database-services';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/quotes')
export class QuotesController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(): Promise<AbstractResponseDto<Quote[]>> {
    const data = await quotesManager.findMany();

    return {
      success: true,
      data,
    };
  }
}
