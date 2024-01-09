import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { MoodEntry } from '@moaitime/database-core';
import { moodEntriesManager } from '@moaitime/database-services';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { CreateMoodEntryDto } from '../dtos/create-mood-entry.dto';
import { UpdateMoodEntryDto } from '../dtos/update-mood-entry.dto';

@Controller('/api/v1/mood-entries')
export class MoodEntriesController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<MoodEntry[]>> {
    const data = await moodEntriesManager.findManyByUserId(req.user.id);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  async view(
    @Req() req: Request,
    @Param('id') id: string
  ): Promise<AbstractResponseDto<MoodEntry>> {
    const canView = await moodEntriesManager.userCanView(id, req.user.id);
    if (!canView) {
      throw new NotFoundException('You cannot view this mood entry');
    }

    const data = await moodEntriesManager.findOneByIdAndUserId(id, req.user.id);
    if (!data) {
      throw new NotFoundException('Mood entry not found');
    }

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(
    @Body() body: CreateMoodEntryDto,
    @Req() req: Request
  ): Promise<AbstractResponseDto<MoodEntry>> {
    const insertData = {
      ...body,
      loggedAt: body.loggedAt ? new Date(body.loggedAt) : new Date(),
      userId: req.user.id,
    };

    const data = await moodEntriesManager.insertOne(insertData);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: UpdateMoodEntryDto
  ): Promise<AbstractResponseDto<MoodEntry>> {
    const canUpdate = await moodEntriesManager.userCanUpdate(id, req.user.id);
    if (!canUpdate) {
      throw new NotFoundException('You cannot update this mood entry');
    }

    const updateData = {
      ...body,
      loggedAt: body.loggedAt ? new Date(body.loggedAt) : undefined,
    };

    const updatedData = await moodEntriesManager.updateOneById(id, updateData);

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
  ): Promise<AbstractResponseDto<MoodEntry>> {
    const canDelete = await moodEntriesManager.userCanDelete(id, req.user.id);
    if (!canDelete) {
      throw new ForbiddenException('You cannot delete this mood entry');
    }

    const updatedData = await moodEntriesManager.updateOneById(id, {
      deletedAt: new Date(),
    });

    return {
      success: true,
      data: updatedData,
    };
  }
}
