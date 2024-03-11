import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { Note, NoteWithoutContent } from '@moaitime/database-core';
import { notesManager } from '@moaitime/database-services';
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

    const data = await notesManager.list(req.user.id, {
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
  @Get(':noteId')
  async view(
    @Req() req: Request,
    @Param('noteId') noteId: string
  ): Promise<AbstractResponseDto<Note>> {
    const data = await notesManager.view(req.user.id, noteId);

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
    const data = await notesManager.create(req.user, body);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':noteId')
  async update(
    @Req() req: Request,
    @Param('noteId') noteId: string,
    @Body() body: UpdateNoteDto
  ): Promise<AbstractResponseDto<Note>> {
    const data = await notesManager.update(req.user.id, noteId, body);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':noteId')
  async delete(
    @Req() req: Request,
    @Param('noteId') noteId: string,
    @Body() body: DeleteDto
  ): Promise<AbstractResponseDto<Note>> {
    const data = await notesManager.delete(req.user.id, noteId, body.isHardDelete);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':noteId/undelete')
  async undelete(
    @Req() req: Request,
    @Param('noteId') noteId: string
  ): Promise<AbstractResponseDto<Note>> {
    const data = await notesManager.undelete(req.user, noteId);

    return {
      success: true,
      data,
    };
  }
}
