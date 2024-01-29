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

import { Calendar } from '@moaitime/database-core';
import { calendarsManager, usersManager } from '@moaitime/database-services';
import { Calendar as ApiCalendar, CreateCalendar, User } from '@moaitime/shared-common';

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
    const calendars = await calendarsManager.findManyByUserId(req.user.id);
    const data = await calendarsManager.convertToApiResponse(calendars, req.user.id);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('deleted')
  async listDeleted(@Req() req: Request): Promise<AbstractResponseDto<ApiCalendar[]>> {
    const calendars = await calendarsManager.findManyDeletedByUserId(req.user.id);
    const data = await calendarsManager.convertToApiResponse(calendars, req.user.id);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('public')
  async listPublic(@Req() req: Request): Promise<AbstractResponseDto<ApiCalendar[]>> {
    const calendars = await calendarsManager.findManyPublic();
    const data = await calendarsManager.convertToApiResponse(calendars, req.user.id);

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
    const calendarsMaxPerUserCount = await usersManager.getUserLimit(
      req.user,
      'calendarsMaxPerUserCount'
    );

    const calendarsCount = await calendarsManager.countByUserId(req.user.id);
    if (calendarsCount >= calendarsMaxPerUserCount) {
      throw new ForbiddenException(
        `You have reached the maximum number of calendars per user (${calendarsMaxPerUserCount}).`
      );
    }

    const insertData = {
      ...body,
      userId: req.user.id,
    } as CreateCalendar;

    const data = await calendarsManager.insertOne(insertData);

    await calendarsManager.addVisibleCalendarIdByUserId(req.user.id, data.id);

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
    const canUpdate = await calendarsManager.userCanUpdate(req.user.id, calendarId);
    if (!canUpdate) {
      throw new ForbiddenException('You cannot update this calendar');
    }

    const updatedData = await calendarsManager.updateOneById(calendarId, body);

    return {
      success: true,
      data: updatedData,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':calendarId')
  async delete(
    @Req() req: Request,
    @Param('calendarId') calendarId: string,
    @Body() body: DeleteDto
  ): Promise<AbstractResponseDto<Calendar>> {
    const canDelete = await calendarsManager.userCanDelete(req.user.id, calendarId);
    if (!canDelete) {
      throw new ForbiddenException('You cannot delete this calendar');
    }

    const data = body.isHardDelete
      ? await calendarsManager.deleteOneById(calendarId)
      : await calendarsManager.updateOneById(calendarId, {
          deletedAt: new Date(),
        });

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
    const canDelete = await calendarsManager.userCanUpdate(req.user.id, calendarId);
    if (!canDelete) {
      throw new ForbiddenException('You cannot undelete this calendar');
    }

    const data = await calendarsManager.updateOneById(calendarId, {
      deletedAt: null,
    });

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
  ): Promise<AbstractResponseDto<User>> {
    const canView = await calendarsManager.userCanView(req.user.id, calendarId);
    if (!canView) {
      throw new ForbiddenException('You cannot view this calendar');
    }

    await calendarsManager.addVisibleCalendarIdByUserId(req.user.id, calendarId);

    return {
      success: true,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':calendarId/visible')
  async removeVisible(
    @Req() req: Request,
    @Param('calendarId') calendarId: string
  ): Promise<AbstractResponseDto<User>> {
    const canView = await calendarsManager.userCanView(req.user.id, calendarId);
    if (!canView) {
      throw new ForbiddenException('You cannot view this calendar');
    }

    await calendarsManager.removeVisibleCalendarIdByUserId(req.user.id, calendarId);

    return {
      success: true,
    };
  }
}
