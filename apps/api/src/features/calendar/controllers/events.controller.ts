import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { calendarsManager, eventsManager, usersManager } from '@moaitime/database-services';
import { getTimezonedEndOfDay, getTimezonedStartOfDay } from '@moaitime/shared-common';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { CreateEventDto } from '../dtos/create-event.dto';
import { UpdateEventDto } from '../dtos/update-event.dto';

@Controller('/api/v1/events')
export class EventsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<Event[]>> {
    const timezone = req.user?.settings?.generalTimezone ?? 'UTC';
    const from = getTimezonedStartOfDay(timezone, req.query.from) ?? undefined;
    const to = getTimezonedEndOfDay(timezone, req.query.to) ?? undefined;

    const calendarIds = await calendarsManager.getVisibleCalendarIdsByUserId(req.user.id);
    const data = await eventsManager.findManyByCalendarIdsAndRange(
      calendarIds,
      req.user.id,
      from,
      to
    );

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
    const calendarsMaxEventsPerCalendarCount = await usersManager.getUserLimits(
      req.user,
      'calendarsMaxEventsPerCalendarCount'
    );

    const listsCount = await eventsManager.countByCalendarId(body.calendarId);
    if (listsCount >= calendarsMaxEventsPerCalendarCount) {
      throw new Error(
        `You have reached the maximum number of events per calendar (${calendarsMaxEventsPerCalendarCount}).`
      );
    }

    const canView = await calendarsManager.userCanView(req.user.id, body.calendarId);
    if (!canView) {
      throw new NotFoundException('Calendar not found');
    }

    const timezone = body.timezone ?? req.user?.settings?.generalTimezone ?? 'UTC';

    const insertData = {
      ...body,
      timezone,
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
    const canView = await eventsManager.userCanUpdate(req.user.id, id);
    if (!canView) {
      throw new ForbiddenException('You cannot update this event');
    }

    const data = await eventsManager.findOneById(id);
    if (!data) {
      throw new NotFoundException('Event not found');
    }

    const now = new Date();
    const startsAt = body.startsAt ? new Date(body.startsAt) : undefined;
    const endsAt = body.endsAt ? new Date(body.endsAt) : undefined;
    const finalStartsAt = startsAt ?? data.startsAt ?? now;
    const finalEndsAt = endsAt ?? data.endsAt ?? now;
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
    const hasAccess = await calendarsManager.userCanDelete(req.user.id, id);
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

  @UseGuards(AuthenticatedGuard)
  @Post(':id/undelete')
  async undelete(
    @Req() req: Request,
    @Param('id') id: string
  ): Promise<AbstractResponseDto<Event>> {
    const canDelete = await eventsManager.userCanUpdate(req.user.id, id);
    if (!canDelete) {
      throw new ForbiddenException('You cannot undelete this event');
    }

    const updatedData = await eventsManager.updateOneById(id, {
      deletedAt: null,
    });

    return {
      success: true,
      data: updatedData,
    };
  }
}
