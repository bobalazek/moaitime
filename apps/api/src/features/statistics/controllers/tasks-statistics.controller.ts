import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { tasksStatisticsManager } from '@moaitime/database-services';

import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/tasks-statistics')
export class TasksStatisticsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async index(@Req() req: Request) {
    const data = await tasksStatisticsManager.getBasics(req.user);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('date-count-map')
  async dateCountMap(@Req() req: Request) {
    const data = await tasksStatisticsManager.getDateCountMap(req.user);

    return {
      success: true,
      data,
    };
  }
}
