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
import { calendarsManager } from '@moaitime/database-services';
import { CALENDARS_MAX_PER_USER_COUNT } from '@moaitime/shared-backend';
import { CreateCalendar } from '@moaitime/shared-common';

import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { AbstractResponseDto } from '../../core/dtos/responses/abstract-response.dto';
import { CreateCalendarDto } from '../dtos/create-calendar.dto';
import { UpdateCalendarDto } from '../dtos/update-calendar.dto';

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

  @UseGuards(AuthenticatedGuard)
  @Get('public')
  async listPublic(): Promise<AbstractResponseDto<Calendar[]>> {
    const data = await calendarsManager.findManyPublic();

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
    const calendarsCount = await calendarsManager.countByUserId(req.user.id);
    if (calendarsCount >= CALENDARS_MAX_PER_USER_COUNT) {
      throw new ForbiddenException(
        `You have reached the maximum number of calendars per user (${CALENDARS_MAX_PER_USER_COUNT}).`
      );
    }

    const insertData = {
      ...body,
      userId: req.user.id,
    } as CreateCalendar;

    const data = await calendarsManager.insertOne(insertData);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: UpdateCalendarDto
  ): Promise<AbstractResponseDto<Calendar>> {
    const canUpdate = await calendarsManager.userCanUpdate(req.user.id, id);
    if (!canUpdate) {
      throw new ForbiddenException('You cannot update this calendar');
    }

    const updatedData = await calendarsManager.updateOneById(id, body);

    return {
      success: true,
      data: updatedData,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  async delete(
    @Req() req: Request,
    @Param('id') id: string
  ): Promise<AbstractResponseDto<Calendar>> {
    const canDelete = await calendarsManager.userCanDelete(req.user.id, id);
    if (!canDelete) {
      throw new ForbiddenException('You cannot delete this calendar');
    }

    const updatedData = await calendarsManager.updateOneById(id, {
      deletedAt: new Date(),
    });

    return {
      success: true,
      data: updatedData,
    };
  }
}
