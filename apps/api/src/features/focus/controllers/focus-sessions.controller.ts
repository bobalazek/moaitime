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
import { FocusSessionUpdateActionEnum } from '@moaitime/shared-common';

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
  @Get(':focusSessionId')
  async view(
    @Req() req: Request,
    @Param('focusSessionId') focusSessionId: string
  ): Promise<AbstractResponseDto<FocusSession | null>> {
    const data =
      focusSessionId === 'active'
        ? await focusSessionsManager.findOneActiveAndByUserId(req.user.id)
        : await focusSessionsManager.findOneByIdAndUserId(focusSessionId, req.user.id);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':focusSessionId/:action')
  async action(
    @Req() req: Request,
    @Param('focusSessionId') focusSessionId: string,
    @Param('action') action: FocusSessionUpdateActionEnum
  ): Promise<AbstractResponseDto<FocusSession>> {
    const data =
      focusSessionId === 'active'
        ? await focusSessionsManager.findOneActiveAndByUserId(req.user.id)
        : await focusSessionsManager.findOneByIdAndUserId(focusSessionId, req.user.id);

    if (!data) {
      throw new NotFoundException('Focus session not found');
    }

    await focusSessionsManager.update(data, action);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':focusSessionId')
  async delete(
    @Req() req: Request,
    @Param('focusSessionId') focusSessionId: string,
    @Body() body: DeleteDto
  ): Promise<AbstractResponseDto<FocusSession>> {
    const hasAccess = await focusSessionsManager.userCanDelete(req.user.id, focusSessionId);
    if (!hasAccess) {
      throw new NotFoundException('Focus session not found');
    }

    const updatedData = body.isHardDelete
      ? await focusSessionsManager.deleteOneById(focusSessionId)
      : await focusSessionsManager.updateOneById(focusSessionId, {
          deletedAt: new Date(),
        });

    return {
      success: true,
      data: updatedData,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':focusSessionId/undelete')
  async undelete(
    @Req() req: Request,
    @Param('focusSessionId') focusSessionId: string
  ): Promise<AbstractResponseDto<FocusSession>> {
    const canDelete = await focusSessionsManager.userCanUpdate(req.user.id, focusSessionId);
    if (!canDelete) {
      throw new ForbiddenException('You cannot undelete this focus session');
    }

    const updatedData = await focusSessionsManager.updateOneById(focusSessionId, {
      deletedAt: null,
    });

    return {
      success: true,
      data: updatedData,
    };
  }
}
