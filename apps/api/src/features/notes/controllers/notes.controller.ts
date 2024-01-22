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

import { Note, NoteWithoutContent } from '@moaitime/database-core';
import { notesManager, usersManager } from '@moaitime/database-services';
import { NotesListSortFieldEnum, SortDirectionEnum } from '@moaitime/shared-common';

import { DeleteDto } from '../../../dtos/delete.dto';
import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';

@Controller('/api/v1/notes')
export class NotesController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<NoteWithoutContent[]>> {
    const search = req.query.search as string;
    const sortField = req.query.sortField as NotesListSortFieldEnum;
    const sortDirection = req.query.sortDirection as SortDirectionEnum;
    const includeDeleted = req.query.includeDeleted === 'true';

    const data = await notesManager.findManyByUserIdWithOptions(req.user.id, {
      search,
      sortField,
      sortDirection,
      includeDeleted,
    });

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  async view(@Req() req: Request, @Param('id') id: string): Promise<AbstractResponseDto<Note>> {
    const canView = await notesManager.userCanView(id, req.user.id);
    if (!canView) {
      throw new NotFoundException('You cannot view this note');
    }

    const data = await notesManager.findOneByIdAndUserId(id, req.user.id);
    if (!data) {
      throw new NotFoundException('Note not found');
    }

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(
    @Body() body: CreateNoteDto,
    @Req() req: Request
  ): Promise<AbstractResponseDto<Note>> {
    const notesMaxPerUserCount = await usersManager.getUserLimits(req.user, 'notesMaxPerUserCount');

    const notesCount = await notesManager.countByUserId(req.user.id);
    if (notesCount >= notesMaxPerUserCount) {
      throw new Error(
        `You have reached the maximum number of notes per user (${notesMaxPerUserCount}).`
      );
    }

    const insertData = {
      ...body,
      userId: req.user.id,
    };

    const data = await notesManager.insertOne(insertData);

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
    @Body() body: UpdateNoteDto
  ): Promise<AbstractResponseDto<Note>> {
    const canView = await notesManager.userCanUpdate(req.user.id, id);
    if (!canView) {
      throw new ForbiddenException('You cannot update this note');
    }

    const data = await notesManager.findOneById(id);
    if (!data) {
      throw new NotFoundException('Note not found');
    }

    const updateData = body;

    const updatedData = await notesManager.updateOneById(id, updateData);

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
  ): Promise<AbstractResponseDto<Note>> {
    const hasAccess = await notesManager.userCanDelete(req.user.id, id);
    if (!hasAccess) {
      throw new NotFoundException('Note not found');
    }

    const updatedData = body.isHardDelete
      ? await notesManager.deleteOneById(id)
      : await notesManager.updateOneById(id, {
          deletedAt: new Date(),
        });

    return {
      success: true,
      data: updatedData,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':id/undelete')
  async undelete(@Req() req: Request, @Param('id') id: string): Promise<AbstractResponseDto<Note>> {
    const canDelete = await notesManager.userCanUpdate(req.user.id, id);
    if (!canDelete) {
      throw new ForbiddenException('You cannot undelete this note');
    }

    const updatedData = await notesManager.updateOneById(id, {
      deletedAt: null,
    });

    return {
      success: true,
      data: updatedData,
    };
  }
}
