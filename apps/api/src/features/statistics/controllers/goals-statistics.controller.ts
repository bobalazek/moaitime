import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { goalsStatisticsManager } from '@moaitime/database-services';

import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/goals-statistics')
export class GoalsStatisticsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async index(@Req() req: Request) {
    const data = await goalsStatisticsManager.getBasics(req.user);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('goals-created')
  async goalsCreated(@Req() req: Request) {
    const from = req.query.from ? new Date(req.query.from as string) : undefined;
    const to = req.query.to ? new Date(req.query.to as string) : undefined;

    const data = await goalsStatisticsManager.getGoalsCreated(req.user, from, to);

    return {
      success: true,
      data,
    };
  }
}
