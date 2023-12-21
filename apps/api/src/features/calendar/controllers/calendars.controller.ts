import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
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
      throw new Error(
        `You have reached the maximum number of calendars per user (${CALENDARS_MAX_PER_USER_COUNT}).`
      );
    }

    const data = await calendarsManager.insertOne(body);

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
    const calendar = await calendarsManager.findOneById(id);
    if (!calendar || calendar.userId !== req.user.id) {
      throw new NotFoundException('Calendar not found');
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
    const hasAccess = await calendarsManager.userHasAccess(req.user.id, id);
    if (!hasAccess) {
      throw new NotFoundException('Calendar not found');
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
