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
}
