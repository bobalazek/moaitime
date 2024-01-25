import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { focusStatisticsManager } from '@moaitime/database-services';

import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/focus-statistics')
export class FocusStatisticsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async index(@Req() req: Request) {
    const data = await focusStatisticsManager.getBasics(req.user);

    return {
      success: true,
      data,
    };
  }
}
