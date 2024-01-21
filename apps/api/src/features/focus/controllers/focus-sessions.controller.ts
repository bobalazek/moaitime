import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { FocusSession } from '@moaitime/database-core';
import { focusSessionsManager, tasksManager } from '@moaitime/database-services';

import { DeleteDto } from '../../../dtos/delete.dto';
import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { CreateFocusSessionDto } from '../dto/create-focus-session.dto';

@Controller('/api/v1/focus-sessions')
export class FocusSessionsController {
  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(
    @Body() body: CreateFocusSessionDto,
    @Req() req: Request
  ): Promise<AbstractResponseDto<FocusSession>> {
    const activeFocusSession = await focusSessionsManager.findOneActiveAndByUserId(req.user.id);
    if (activeFocusSession) {
      throw new ForbiddenException('You already have an active focus session');
    }

    if (body.taskId) {
      const userCanView = await tasksManager.userCanView(req.user.id, body.taskId);
      if (!userCanView) {
        throw new NotFoundException('Task not found');
      }
    }

    const insertData = {
      ...body,
      userId: req.user.id,
    };

    const data = await focusSessionsManager.insertOne(insertData);

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
  ): Promise<AbstractResponseDto<FocusSession | null>> {
    const data =
      id === 'active'
        ? await focusSessionsManager.findOneActiveAndByUserId(req.user.id)
        : await focusSessionsManager.findOneByIdAndUserId(id, req.user.id);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  async delete(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: DeleteDto
  ): Promise<AbstractResponseDto<FocusSession>> {
    const hasAccess = await focusSessionsManager.userCanDelete(req.user.id, id);
    if (!hasAccess) {
      throw new NotFoundException('Focus session not found');
    }

    const updatedData = body.isHardDelete
      ? await focusSessionsManager.deleteOneById(id)
      : await focusSessionsManager.updateOneById(id, {
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
  ): Promise<AbstractResponseDto<FocusSession>> {
    const canDelete = await focusSessionsManager.userCanUpdate(req.user.id, id);
    if (!canDelete) {
      throw new ForbiddenException('You cannot undelete this focus session');
    }

    const updatedData = await focusSessionsManager.updateOneById(id, {
      deletedAt: null,
    });

    return {
      success: true,
      data: updatedData,
    };
  }
}
