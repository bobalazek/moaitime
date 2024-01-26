import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { calendarStatisticsManager } from '@moaitime/database-services';

import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/calendar-statistics')
export class CalendarStatisticsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async index(@Req() req: Request) {
    const data = await calendarStatisticsManager.getBasics(req.user);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('events-created')
  async eventsCreated(@Req() req: Request) {
    const from = req.query.from ? new Date(req.query.from as string) : undefined;
    const to = req.query.to ? new Date(req.query.to as string) : undefined;

    const data = await calendarStatisticsManager.getEventsCreated(req.user, from, to);

    return {
      success: true,
      data,
    };
  }
}
