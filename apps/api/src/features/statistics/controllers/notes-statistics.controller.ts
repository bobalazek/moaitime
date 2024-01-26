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

  @UseGuards(AuthenticatedGuard)
  @Get('notes-created')
  async notesCreated(@Req() req: Request) {
    const from = req.query.from ? new Date(req.query.from as string) : undefined;
    const to = req.query.to ? new Date(req.query.to as string) : undefined;

    const data = await notesStatisticsManager.getNotesCreated(req.user, from, to);

    return {
      success: true,
      data,
    };
  }
}
