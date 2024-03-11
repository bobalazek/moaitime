import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { Event } from '@moaitime/database-core';
import { eventsManager } from '@moaitime/database-services';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { CreateEventDto } from '../dtos/create-event.dto';
import { UpdateEventDto } from '../dtos/update-event.dto';

@Controller('/api/v1/events')
export class EventsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<Event[]>> {
    const from = req.query.from as string;
    const to = req.query.to as string;

    const data = await eventsManager.list(req.user, from, to);

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
    const data = await eventsManager.create(req.user, body);

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
    const data = await eventsManager.update(req.user.id, eventId, body);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':eventId')
  async delete(
    @Req() req: Request,
    @Param('eventId') eventId: string
  ): Promise<AbstractResponseDto<Event>> {
    const data = await eventsManager.delete(req.user.id, eventId);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':eventId/undelete')
  async undelete(
    @Req() req: Request,
    @Param('eventId') eventId: string
  ): Promise<AbstractResponseDto<Event>> {
    const data = await eventsManager.undelete(req.user, eventId);

    return {
      success: true,
      data,
    };
  }
}
