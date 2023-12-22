import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { Note } from '@moaitime/database-core';
import { notesManager } from '@moaitime/database-services';

import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { AbstractResponseDto } from '../../core/dtos/responses/abstract-response.dto';

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
}
