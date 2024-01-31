import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { calendarsManager } from '@moaitime/database-services';
import {
  CreateUserCalendar,
  UpdateUserCalendar,
  User,
  UserCalendar,
} from '@moaitime/shared-common';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/user-calendars')
export class UserCalendarsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<UserCalendar[]>> {
    const data = await calendarsManager.listUserCalendars(req.user.id);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(
    @Req() req: Request,
    @Body() body: CreateUserCalendar
  ): Promise<AbstractResponseDto<User>> {
    await calendarsManager.createUserCalendar(req.user, body.calendarId);

    return {
      success: true,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':userCalendarId')
  async delete(
    @Req() req: Request,
    @Param('userCalendarId') userCalendarId: string
  ): Promise<AbstractResponseDto<User>> {
    await calendarsManager.deleteUserCalendar(req.user.id, userCalendarId);

    return {
      success: true,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':userCalendarId')
  async update(
    @Req() req: Request,
    @Param('userCalendarId') userCalendarId: string,
    @Body() body: UpdateUserCalendar
  ): Promise<AbstractResponseDto<User>> {
    await calendarsManager.updateUserCalendar(req.user.id, userCalendarId, body);

    return {
      success: true,
    };
  }
}
