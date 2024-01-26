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

  @UseGuards(AuthenticatedGuard)
  @Get('focus-sessions-created')
  async focusSessionsCreated(@Req() req: Request) {
    const from = req.query.from ? new Date(req.query.from as string) : undefined;
    const to = req.query.to ? new Date(req.query.to as string) : undefined;

    const data = await focusStatisticsManager.getFocusSessionsCreated(req.user, from, to);

    return {
      success: true,
      data,
    };
  }
}
