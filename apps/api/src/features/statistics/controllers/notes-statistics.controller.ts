import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { notesStatisticsManager } from '@moaitime/database-services';

import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/notes-statistics')
export class NotesStatisticsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async index(@Req() req: Request) {
    const data = await notesStatisticsManager.getBasics(req.user);

    return {
      success: true,
      data,
    };
  }
}
