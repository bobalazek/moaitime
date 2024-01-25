import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { subDays } from 'date-fns';
import { Request } from 'express';

import { moodStatisticsManager } from '@moaitime/database-services';

import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/mood-statistics')
export class MoodStatisticsController {
  @UseGuards(AuthenticatedGuard)
  @Get('daily')
  async daily(@Req() req: Request) {
    const to = new Date();
    const from = subDays(to, 28);

    const data = await moodStatisticsManager.getDailyAverage(req.user, from, to);

    return {
      success: true,
      data,
    };
  }
}
