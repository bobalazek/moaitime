import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { teamsManager } from '@moaitime/database-services';
import { JoinedTeam } from '@moaitime/shared-common';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../guards/authenticated.guard';

@Controller('/api/v1/joined-team')
export class JoinedTeamController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async index(@Req() req: Request): Promise<AbstractResponseDto<JoinedTeam | null>> {
    const data = await teamsManager.getJoinedTeamByUserId(req.user.id);

    return {
      success: true,
      data: data as unknown as JoinedTeam,
    };
  }
}
