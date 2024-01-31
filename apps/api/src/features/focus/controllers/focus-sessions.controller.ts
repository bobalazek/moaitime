import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { FocusSession } from '@moaitime/database-core';
import { focusSessionsManager } from '@moaitime/database-services';
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
    const data = await focusSessionsManager.create(req.user.id, body);

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
    const updatePing = req.query.updatePing === 'true';

    const data = await focusSessionsManager.view(req.user.id, focusSessionId, updatePing);

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
    const data = await focusSessionsManager.doAction(req.user.id, focusSessionId, action);

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
    const data = await focusSessionsManager.delete(req.user.id, focusSessionId, body.isHardDelete);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':focusSessionId/undelete')
  async undelete(
    @Req() req: Request,
    @Param('focusSessionId') focusSessionId: string
  ): Promise<AbstractResponseDto<FocusSession>> {
    const data = await focusSessionsManager.undelete(req.user.id, focusSessionId);

    return {
      success: true,
      data,
    };
  }
}
