import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { Calendar } from '@moaitime/database-core';
import { calendarsManager } from '@moaitime/database-services';
import { Calendar as ApiCalendar } from '@moaitime/shared-common';

import { DeleteDto } from '../../../dtos/delete.dto';
import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { CreateCalendarDto } from '../dtos/create-calendar.dto';
import { UpdateCalendarDto } from '../dtos/update-calendar.dto';

@Controller('/api/v1/calendars')
export class CalendarsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<ApiCalendar[]>> {
    const data = await calendarsManager.list(req.user.id);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('deleted')
  async listDeleted(@Req() req: Request): Promise<AbstractResponseDto<ApiCalendar[]>> {
    const data = await calendarsManager.listDeleted(req.user.id);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('public')
  async listPublic(@Req() req: Request): Promise<AbstractResponseDto<ApiCalendar[]>> {
    const data = await calendarsManager.listPublic(req.user.id);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(
    @Body() body: CreateCalendarDto,
    @Req() req: Request
  ): Promise<AbstractResponseDto<Calendar>> {
    const data = await calendarsManager.create(req.user, body);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':calendarId')
  async update(
    @Req() req: Request,
    @Param('calendarId') calendarId: string,
    @Body() body: UpdateCalendarDto
  ): Promise<AbstractResponseDto<Calendar>> {
    const data = await calendarsManager.update(req.user.id, calendarId, body);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':calendarId')
  async delete(
    @Req() req: Request,
    @Param('calendarId') calendarId: string,
    @Body() body: DeleteDto
  ): Promise<AbstractResponseDto<Calendar>> {
    const data = await calendarsManager.delete(req.user.id, calendarId, body.isHardDelete);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':calendarId/undelete')
  async undelete(
    @Req() req: Request,
    @Param('calendarId') calendarId: string
  ): Promise<AbstractResponseDto<Calendar>> {
    const data = await calendarsManager.undelete(req.user.id, calendarId);

    return {
      success: true,
      data,
    };
  }

  // Visible
  @UseGuards(AuthenticatedGuard)
  @Post(':calendarId/visible')
  async addVisible(
    @Req() req: Request,
    @Param('calendarId') calendarId: string
  ): Promise<AbstractResponseDto> {
    await calendarsManager.addVisible(req.user.id, calendarId);

    return {
      success: true,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':calendarId/visible')
  async removeVisible(
    @Req() req: Request,
    @Param('calendarId') calendarId: string
  ): Promise<AbstractResponseDto> {
    await calendarsManager.removeVisible(req.user.id, calendarId);

    return {
      success: true,
    };
  }
}
