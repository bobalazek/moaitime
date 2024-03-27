import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { habitsStatisticsManager } from '@moaitime/database-services';

import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/habits-statistics')
export class HabitsStatisticsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async index(@Req() req: Request) {
    const data = await habitsStatisticsManager.getBasics(req.user);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('habits-created')
  async habitsCreated(@Req() req: Request) {
    const from = req.query.from ? new Date(req.query.from as string) : undefined;
    const to = req.query.to ? new Date(req.query.to as string) : undefined;

    const data = await habitsStatisticsManager.getHabitsCreated(req.user, from, to);

    return {
      success: true,
      data,
    };
  }
}
