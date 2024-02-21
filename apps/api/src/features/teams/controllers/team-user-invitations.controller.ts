import { Controller, Delete, NotFoundException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { teamsManager } from '@moaitime/database-services';
import { TeamUserInvitation } from '@moaitime/shared-common';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/team-user-invitations')
export class TeamUserInvitationsController {
  @UseGuards(AuthenticatedGuard)
  @Post(':teamUserInvitationId/accept')
  async accept(
    @Req() req: Request,
    @Param('teamUserInvitationId') teamUserInvitationId: string
  ): Promise<AbstractResponseDto<TeamUserInvitation>> {
    const data = await teamsManager.acceptInvitationByIdAndUserId(
      teamUserInvitationId,
      req.user.id
    );
    if (!data) {
      throw new NotFoundException('Invitation not found');
    }

    return {
      success: true,
      data: data as unknown as TeamUserInvitation,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':teamUserInvitationId/reject')
  async reject(
    @Req() req: Request,
    @Param('teamUserInvitationId') teamUserInvitationId: string
  ): Promise<AbstractResponseDto<TeamUserInvitation>> {
    const data = await teamsManager.rejectInvitationByIdAndUserId(
      teamUserInvitationId,
      req.user.id
    );
    if (!data) {
      throw new NotFoundException('Invitation not found');
    }

    return {
      success: true,
      data: data as unknown as TeamUserInvitation,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':teamUserInvitationId')
  async delete(
    @Req() req: Request,
    @Param('teamUserInvitationId') teamUserInvitationId: string
  ): Promise<AbstractResponseDto<TeamUserInvitation>> {
    const data = await teamsManager.deleteInvitationByIdAndUserId(
      teamUserInvitationId,
      req.user.id
    );
    if (!data) {
      throw new NotFoundException('Invitation not found');
    }

    return {
      success: true,
      data: data as unknown as TeamUserInvitation,
    };
  }
}