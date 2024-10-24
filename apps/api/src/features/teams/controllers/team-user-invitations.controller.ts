import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { teamsManager } from '@moaitime/database-services';
import { TeamUserInvitation } from '@moaitime/shared-common';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/team-user-invitations')
export class TeamUserInvitationsController {
  @UseGuards(AuthenticatedGuard)
  @Get('my')
  async my(@Req() req: Request): Promise<AbstractResponseDto<TeamUserInvitation[]>> {
    const data = await teamsManager.getUserInvitations(req.user.id, req.user.email);

    return {
      success: true,
      data: data as unknown as TeamUserInvitation[],
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':teamUserInvitationId/accept')
  async accept(
    @Req() req: Request,
    @Param('teamUserInvitationId') teamUserInvitationId: string
  ): Promise<AbstractResponseDto<TeamUserInvitation>> {
    const data = await teamsManager.acceptTeamInvitation(req.user.id, teamUserInvitationId);
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
    const data = await teamsManager.rejectTeamInvitation(req.user.id, teamUserInvitationId);
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
    const data = await teamsManager.deleteTeamInvitation(req.user.id, teamUserInvitationId);
    if (!data) {
      throw new NotFoundException('Invitation not found');
    }

    return {
      success: true,
      data: data as unknown as TeamUserInvitation,
    };
  }
}
