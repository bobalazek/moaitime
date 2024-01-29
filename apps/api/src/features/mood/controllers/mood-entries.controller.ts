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

import { MoodEntry } from '@moaitime/database-core';
import { moodEntriesManager } from '@moaitime/database-services';

import { DeleteDto } from '../../../dtos/delete.dto';
import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { CreateMoodEntryDto } from '../dtos/create-mood-entry.dto';
import { UpdateMoodEntryDto } from '../dtos/update-mood-entry.dto';

@Controller('/api/v1/mood-entries')
export class MoodEntriesController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<MoodEntry[]>> {
    const limit = 10;
    const previousCursorParameter = req.query.previousCursor as string | undefined;
    const nextCursorParameter = req.query.nextCursor as string | undefined;

    const { data, meta } = await moodEntriesManager.findManyByUserId(req.user.id, {
      limit,
      previousCursor: previousCursorParameter,
      nextCursor: nextCursorParameter,
    });

    return {
      success: true,
      data,
      meta,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':moodEntryId')
  async view(
    @Req() req: Request,
    @Param('moodEntryId') moodEntryId: string
  ): Promise<AbstractResponseDto<MoodEntry>> {
    const canView = await moodEntriesManager.userCanView(moodEntryId, req.user.id);
    if (!canView) {
      throw new NotFoundException('You cannot view this mood entry');
    }

    const data = await moodEntriesManager.findOneByIdAndUserId(moodEntryId, req.user.id);
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
      loggedAt: body.loggedAt ?? new Date().toISOString(),
      userId: req.user.id,
    };

    const data = await moodEntriesManager.insertOne(insertData);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':moodEntryId')
  async update(
    @Req() req: Request,
    @Param('moodEntryId') moodEntryId: string,
    @Body() body: UpdateMoodEntryDto
  ): Promise<AbstractResponseDto<MoodEntry>> {
    const canUpdate = await moodEntriesManager.userCanUpdate(moodEntryId, req.user.id);
    if (!canUpdate) {
      throw new NotFoundException('You cannot update this mood entry');
    }

    const updateData = {
      ...body,
      loggedAt: body.loggedAt ? new Date(body.loggedAt).toISOString() : undefined,
    };

    const data = await moodEntriesManager.updateOneById(moodEntryId, updateData);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':moodEntryId')
  async delete(
    @Req() req: Request,
    @Param('moodEntryId') moodEntryId: string,
    @Body() body: DeleteDto
  ): Promise<AbstractResponseDto<MoodEntry>> {
    const canDelete = await moodEntriesManager.userCanDelete(moodEntryId, req.user.id);
    if (!canDelete) {
      throw new ForbiddenException('You cannot delete this mood entry');
    }

    const data = body.isHardDelete
      ? await moodEntriesManager.deleteOneById(moodEntryId)
      : await moodEntriesManager.updateOneById(moodEntryId, {
          deletedAt: new Date(),
        });

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':moodEntryId/undelete')
  async undelete(
    @Req() req: Request,
    @Param('moodEntryId') moodEntryId: string
  ): Promise<AbstractResponseDto<MoodEntry>> {
    const canDelete = await moodEntriesManager.userCanUpdate(moodEntryId, req.user.id);
    if (!canDelete) {
      throw new ForbiddenException('You cannot undelete this mood entry');
    }

    const data = await moodEntriesManager.updateOneById(moodEntryId, {
      deletedAt: null,
    });

    return {
      success: true,
      data,
    };
  }
}
