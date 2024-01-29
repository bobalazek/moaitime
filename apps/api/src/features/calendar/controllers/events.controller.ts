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

    const calendarIdsMap = await calendarsManager.getVisibleCalendarIdsByUserIdMap(req.user.id);
    const data = await eventsManager.findManyByCalendarIdsAndRange(
      calendarIdsMap,
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
    const calendarsMaxEventsPerCalendarCount = await usersManager.getUserLimit(
      req.user,
      'calendarsMaxEventsPerCalendarCount'
    );

    const eventsCount = await eventsManager.countByCalendarId(body.calendarId);
    if (eventsCount >= calendarsMaxEventsPerCalendarCount) {
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
      userId: req.user.id,
      startsAt: new Date(body.startsAt),
      endsAt: new Date(body.endsAt),
      repeatEndsAt: body.repeatEndsAt ? new Date(body.repeatEndsAt) : undefined,
    };

    const data = await eventsManager.insertOne(insertData);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':eventId')
  async update(
    @Req() req: Request,
    @Param('eventId') eventId: string,
    @Body() body: UpdateEventDto
  ): Promise<AbstractResponseDto<Event>> {
    const canView = await eventsManager.userCanUpdate(req.user.id, eventId);
    if (!canView) {
      throw new ForbiddenException('You cannot update this event');
    }

    const data = await eventsManager.findOneById(eventId);
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

    // We need to account for the null value, which means to unset the value,
    // where as undefined means to not update the value.
    const repeatEndsAt = body.repeatEndsAt
      ? new Date(body.repeatEndsAt)
      : body.repeatEndsAt === null
        ? null
        : undefined;

    const updateData = {
      ...body,
      startsAt,
      endsAt,
      repeatEndsAt,
    };

    const updatedData = await eventsManager.updateOneById(eventId, updateData);

    return {
      success: true,
      data: updatedData,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':eventId')
  async delete(
    @Req() req: Request,
    @Param('eventId') eventId: string
  ): Promise<AbstractResponseDto<Event>> {
    const canDelete = await eventsManager.userCanDelete(req.user.id, eventId);
    if (!canDelete) {
      throw new NotFoundException('Calendar not found');
    }

    const data = await eventsManager.updateOneById(eventId, {
      deletedAt: new Date(),
    });

    return {
      success: true,
      data: data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':eventId/undelete')
  async undelete(
    @Req() req: Request,
    @Param('eventId') eventId: string
  ): Promise<AbstractResponseDto<Event>> {
    const canDelete = await eventsManager.userCanUpdate(req.user.id, eventId);
    if (!canDelete) {
      throw new ForbiddenException('You cannot undelete this event');
    }

    const data = await eventsManager.updateOneById(eventId, {
      deletedAt: null,
    });

    return {
      success: true,
      data,
    };
  }
}
