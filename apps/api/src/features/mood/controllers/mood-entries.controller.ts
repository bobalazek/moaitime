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
    const limit = 5;
    const beforeCursorQueryParameter = req.query.beforeCursor as string | undefined;
    const afterCursorQueryParameter = req.query.afterCursor as string | undefined;

    const { data, beforeCursor, afterCursor } = await moodEntriesManager.findManyByUserId(
      req.user.id,
      {
        limit,
        beforeCursor: beforeCursorQueryParameter,
        afterCursor: afterCursorQueryParameter,
      }
    );

    return {
      success: true,
      data,
      meta: {
        limit,
        beforeCursor,
        afterCursor,
      },
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
  @Patch(':id')
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
      loggedAt: body.loggedAt ? new Date(body.loggedAt).toISOString() : undefined,
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
    @Param('id') id: string,
    @Body() body: DeleteDto
  ): Promise<AbstractResponseDto<MoodEntry>> {
    const canDelete = await moodEntriesManager.userCanDelete(id, req.user.id);
    if (!canDelete) {
      throw new ForbiddenException('You cannot delete this mood entry');
    }

    const updatedData = body.isHardDelete
      ? await moodEntriesManager.deleteOneById(id)
      : await moodEntriesManager.updateOneById(id, {
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
  ): Promise<AbstractResponseDto<MoodEntry>> {
    const canDelete = await moodEntriesManager.userCanDelete(id, req.user.id);
    if (!canDelete) {
      throw new ForbiddenException('You cannot undelete this mood entry');
    }

    const updatedData = await moodEntriesManager.updateOneById(id, {
      deletedAt: null,
    });

    return {
      success: true,
      data: updatedData,
    };
  }
}
