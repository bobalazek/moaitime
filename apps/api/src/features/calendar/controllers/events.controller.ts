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

import { Event } from '@moaitime/database-core';
import { calendarsManager, eventsManager } from '@moaitime/database-services';
import { CALENDAR_EVENTS_MAX_COUNT } from '@moaitime/shared-backend';

import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { AbstractResponseDto } from '../../core/dtos/responses/abstract-response.dto';
import { getTimezonedEndOfDay, getTimezonedStartOfDay } from '../../core/utils/time-helpers';
import { CreateEventDto } from '../dtos/create-event.dto';
import { UpdateEventDto } from '../dtos/update-task.dto';

@Controller('/api/v1/events')
export class EventsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<Event[]>> {
    const timezone = req.user?.settings?.generalTimezone ?? 'UTC';
    const from = getTimezonedStartOfDay(timezone, req.query.from) ?? undefined;
    const to = getTimezonedEndOfDay(timezone, req.query.to) ?? undefined;

    const data = await eventsManager.findManyByUserId(req.user.id, from, to);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(
    @Body() body: CreateEventDto,
    @Req() req: Request
  ): Promise<AbstractResponseDto<Event>> {
    const listsCount = await eventsManager.countByCalendarId(body.calendarId);
    if (listsCount >= CALENDAR_EVENTS_MAX_COUNT) {
      throw new Error(
        `You have reached the maximum number of events per calendar (${CALENDAR_EVENTS_MAX_COUNT}).`
      );
    }

    const hasAccess = await calendarsManager.userHasAccess(req.user.id, body.calendarId);
    if (!hasAccess) {
      throw new NotFoundException('Calendar not found');
    }

    const insertData = {
      ...body,
      startsAt: new Date(body.startsAt),
      endsAt: new Date(body.endsAt),
    };

    const data = await eventsManager.insertOne(insertData);

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
    @Body() body: UpdateEventDto
  ): Promise<AbstractResponseDto<Event>> {
    const hasAccess = await calendarsManager.userHasAccess(req.user.id, id);
    if (!hasAccess) {
      throw new NotFoundException('Calendar not found');
    }

    const event = await eventsManager.findOneById(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const now = new Date();
    const startsAt = body.startsAt ? new Date(body.startsAt) : undefined;
    const endsAt = body.endsAt ? new Date(body.endsAt) : undefined;
    const finalStartsAt = startsAt ?? event.startsAt ?? now;
    const finalEndsAt = endsAt ?? event.endsAt ?? now;
    if (finalStartsAt > finalEndsAt) {
      throw new Error('Start date must be before end date');
    }

    const updateData = {
      ...body,
      startsAt,
      endsAt,
    };

    const updatedData = await eventsManager.updateOneById(id, updateData);

    return {
      success: true,
      data: updatedData,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: string): Promise<AbstractResponseDto<Event>> {
    const hasAccess = await calendarsManager.userHasAccess(req.user.id, id);
    if (!hasAccess) {
      throw new NotFoundException('Calendar not found');
    }

    const updatedData = await eventsManager.updateOneById(id, {
      deletedAt: new Date(),
    });

    return {
      success: true,
      data: updatedData,
    };
  }
}
