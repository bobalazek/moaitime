import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
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

    const { data, meta } = await moodEntriesManager.findManyByUserIdWithDataAndMeta(req.user.id, {
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
    const data = await moodEntriesManager.view(req.user.id, moodEntryId);

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
    const data = await moodEntriesManager.create(req.user.id, body);

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
    const data = await moodEntriesManager.update(req.user.id, moodEntryId, body);

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
    const data = await moodEntriesManager.delete(req.user.id, moodEntryId, body.isHardDelete);

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
    const data = await moodEntriesManager.undelete(req.user.id, moodEntryId);

    return {
      success: true,
      data,
    };
  }
}
