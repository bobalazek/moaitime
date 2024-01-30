import { Controller, Get, NotFoundException, Param, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { TeamUser } from '@moaitime/database-core';
import { teamsManager } from '@moaitime/database-services';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../guards/authenticated.guard';

@Controller('/api/v1/team-user-invitations')
export class TeamUserInvitationsController {
  @UseGuards(AuthenticatedGuard)
  @Get(':teamUserId/accept')
  async accept(
    @Req() req: Request,
    @Param('teamUserId') teamUserId: string
  ): Promise<AbstractResponseDto<TeamUser>> {
    const data = await teamsManager.acceptInvitationByUserId(req.user.id, teamUserId);
    if (!data) {
      throw new NotFoundException('Invitation not found');
    }

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':teamUserId/reject')
  async reject(
    @Req() req: Request,
    @Param('teamUserId') teamUserId: string
  ): Promise<AbstractResponseDto<TeamUser>> {
    const data = await teamsManager.rejectInvitationByUserId(req.user.id, teamUserId);
    if (!data) {
      throw new NotFoundException('Invitation not found');
    }

    return {
      success: true,
      data,
    };
  }

  // My Invitations
  @UseGuards(AuthenticatedGuard)
  @Get('my-invitations')
  async myInvitations(@Req() req: Request): Promise<AbstractResponseDto<TeamUser[]>> {
    const data = await teamsManager.getInvitationsByUser(req.user.id, req.user.email);

    return {
      success: true,
      data,
    };
  }
}
