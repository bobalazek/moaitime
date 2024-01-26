import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { moodStatisticsManager } from '@moaitime/database-services';

import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/mood-statistics')
export class MoodStatisticsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async index(@Req() req: Request) {
    const data = await moodStatisticsManager.getBasics(req.user);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('mood-entries-created')
  async moodEntriesCreated(@Req() req: Request) {
    const from = req.query.from ? new Date(req.query.from as string) : undefined;
    const to = req.query.to ? new Date(req.query.to as string) : undefined;

    const data = await moodStatisticsManager.getMoodEntriesCreated(req.user, from, to);

    return {
      success: true,
      data,
    };
  }
}
