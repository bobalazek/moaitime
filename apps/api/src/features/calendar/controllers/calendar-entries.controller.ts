import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { calendarEntriesManager } from '@moaitime/database-services';
import { CalendarEntry, CalendarEntryYearlyEntry } from '@moaitime/shared-common';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/calendar-entries')
export class CalendarEntriesController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<CalendarEntry[]>> {
    const from = req.query.from as string;
    const to = req.query.to as string;

    const data = await calendarEntriesManager.list(req.user, from, to);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('yearly')
  async yearly(@Req() req: Request): Promise<AbstractResponseDto<CalendarEntryYearlyEntry[]>> {
    const year = parseInt(req.query.year);

    const data = await calendarEntriesManager.yearly(req.user.id, year);

    return {
      success: true,
      data,
    };
  }
}
