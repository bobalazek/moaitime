import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { Calendar } from '@moaitime/database-core';
import { calendarsManager } from '@moaitime/database-services';

import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { AbstractResponseDto } from '../../core/dtos/responses/abstract-response.dto';

@Controller('/api/v1/calendars')
export class CalendarsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<Calendar[]>> {
    const data = await calendarsManager.findManyByUserId(req.user.id);

    return {
      success: true,
      data,
    };
  }
}
