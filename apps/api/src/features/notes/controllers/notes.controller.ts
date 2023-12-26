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

import { Note } from '@moaitime/database-core';
import { notesManager } from '@moaitime/database-services';
import { NOTES_MAX_PER_USER_COUNT } from '@moaitime/shared-backend';

import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { AbstractResponseDto } from '../../core/dtos/responses/abstract-response.dto';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';

@Controller('/api/v1/notes')
export class NotesController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<Note[]>> {
    const data = await notesManager.findManyByUserId(req.user.id);

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
    const listsCount = await notesManager.countByUserId(req.user.id);
    if (listsCount >= NOTES_MAX_PER_USER_COUNT) {
      throw new Error(
        `You have reached the maximum number of notes per user (${NOTES_MAX_PER_USER_COUNT}).`
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
      throw new ForbiddenException('You cannot view this note');
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
  async delete(@Req() req: Request, @Param('id') id: string): Promise<AbstractResponseDto<Note>> {
    const hasAccess = await notesManager.userCanDelete(req.user.id, id);
    if (!hasAccess) {
      throw new NotFoundException('Calendar not found');
    }

    const updatedData = await notesManager.updateOneById(id, {
      deletedAt: new Date(),
    });

    return {
      success: true,
      data: updatedData,
    };
  }
}
