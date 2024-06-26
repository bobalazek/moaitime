import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { TeamUser } from '@moaitime/database-core';
import { teamsManager } from '@moaitime/database-services';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/my-team-user-invitations')
export class MyTeamUserInvitationsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async myInvitations(@Req() req: Request): Promise<AbstractResponseDto<TeamUser[]>> {
    const data = await teamsManager.getUserInvitations(req.user.id, req.user.email);

    return {
      success: true,
      data: data as unknown as TeamUser[],
    };
  }
}
