import { Controller, Get, UseGuards } from '@nestjs/common';

import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/statistics')
export class StatisticsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async index() {
    const data = {};

    return {
      success: true,
      data,
    };
  }
}
