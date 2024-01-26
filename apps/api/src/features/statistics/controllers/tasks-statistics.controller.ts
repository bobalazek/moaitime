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
  @Get('tasks-created')
  async tasksCreated(@Req() req: Request) {
    const from = req.query.from ? new Date(req.query.from as string) : undefined;
    const to = req.query.to ? new Date(req.query.to as string) : undefined;

    const data = await tasksStatisticsManager.getTasksCreated(req.user, from, to);

    return {
      success: true,
      data,
    };
  }
}
