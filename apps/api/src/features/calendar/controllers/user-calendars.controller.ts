import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { UserCalendar } from '@moaitime/database-core';
import { calendarsManager } from '@moaitime/database-services';
import { CreateUserCalendar, UpdateUserCalendar, User } from '@moaitime/shared-common';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/user-calendars')
export class UserCalendarsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<UserCalendar[]>> {
    const data = await calendarsManager.getUserCalendarsByUserId(req.user.id);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':userCalendarId')
  async view(
    @Req() req: Request,
    @Param('userCalendarId') userCalendarId: string
  ): Promise<AbstractResponseDto<UserCalendar | null>> {
    const data = await calendarsManager.getUserCalendar(req.user.id, userCalendarId);

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
    const canView = await calendarsManager.userCanView(req.user.id, body.calendarId);
    if (!canView) {
      throw new ForbiddenException('You cannot add this calendar');
    }

    await calendarsManager.addUserCalendarToUser(req.user.id, body.calendarId);

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
    await calendarsManager.deleteUserCalendarFromUser(req.user.id, userCalendarId);

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
    const canView = await calendarsManager.userCanUpdateUserCalendar(req.user.id, userCalendarId);
    if (!canView) {
      throw new ForbiddenException('You cannot update this shared calendar');
    }

    await calendarsManager.updateUserCalendar(req.user.id, userCalendarId, body);

    return {
      success: true,
    };
  }
}
