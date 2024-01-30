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

import { Team, TeamUser, TeamUserInvitation } from '@moaitime/database-core';
import { teamsManager, usersManager } from '@moaitime/database-services';
import { JoinedTeam } from '@moaitime/shared-common';

import { DeleteDto } from '../../../dtos/delete.dto';
import { EmailDto } from '../../../dtos/email.dto';
import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { CreateTeamDto } from '../dtos/create-team.dto';
import { UpdateTeamDto } from '../dtos/update-team.dto';
import { AuthenticatedGuard } from '../guards/authenticated.guard';

@Controller('/api/v1/teams')
export class TeamsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<Team[]>> {
    const data = await teamsManager.findManyByUserId(req.user.id);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(
    @Body() body: CreateTeamDto,
    @Req() req: Request
  ): Promise<AbstractResponseDto<Team>> {
    const teamsMaxPerUserCount = await usersManager.getUserLimit(req.user, 'teamsMaxPerUserCount');

    const teamsCount = await teamsManager.countByUserId(req.user.id);
    if (teamsCount >= teamsMaxPerUserCount) {
      throw new Error(
        `You have reached the maximum number of teams per user (${teamsMaxPerUserCount}).`
      );
    }

    const data = await teamsManager.createAndJoin(req.user.id, body.name);

    return {
      success: true,
      data: data.team,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':teamId')
  async update(
    @Req() req: Request,
    @Param('teamId') teamId: string,
    @Body() body: UpdateTeamDto
  ): Promise<AbstractResponseDto<Team>> {
    const canView = await teamsManager.userCanUpdate(req.user.id, teamId);
    if (!canView) {
      throw new ForbiddenException('You cannot update this team');
    }

    const data = await teamsManager.findOneById(teamId);
    if (!data) {
      throw new NotFoundException('Team not found');
    }

    const updatedData = await teamsManager.updateOneById(teamId, body);

    return {
      success: true,
      data: updatedData,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':teamId')
  async delete(
    @Req() req: Request,
    @Param('teamId') teamId: string,
    @Body() body: DeleteDto
  ): Promise<AbstractResponseDto<Team>> {
    const canDelete = await teamsManager.userCanDelete(req.user.id, teamId);
    if (!canDelete) {
      throw new NotFoundException('Team not found');
    }

    const data = body.isHardDelete
      ? await teamsManager.deleteOneById(teamId)
      : await teamsManager.updateOneById(teamId, {
          deletedAt: new Date(),
        });

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':teamId/undelete')
  async undelete(
    @Req() req: Request,
    @Param('teamId') teamId: string
  ): Promise<AbstractResponseDto<Team>> {
    const canDelete = await teamsManager.userCanUpdate(req.user.id, teamId);
    if (!canDelete) {
      throw new ForbiddenException('You cannot undelete this team');
    }

    const data = await teamsManager.updateOneById(teamId, {
      deletedAt: null,
    });

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':teamId/leave')
  async leave(
    @Req() req: Request,
    @Param('teamId') teamId: string
  ): Promise<AbstractResponseDto<TeamUser>> {
    const data = await teamsManager.leaveTeam(req.user.id, teamId);

    return {
      success: true,
      data,
    };
  }

  // Invitations
  @UseGuards(AuthenticatedGuard)
  @Get(':teamId/invitations')
  async invitations(
    @Req() req: Request,
    @Param('teamId') teamId: string
  ): Promise<AbstractResponseDto<TeamUserInvitation[]>> {
    const data = await teamsManager.getInvitationsByTeamId(teamId);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':teamId/invite')
  async invite(
    @Req() req: Request,
    @Param('teamId') teamId: string,
    @Body() body: EmailDto
  ): Promise<AbstractResponseDto<TeamUser>> {
    const data = await teamsManager.sendInvitation(teamId, req.user.id, body.email);

    return {
      success: true,
      data,
    };
  }

  // Members
  @UseGuards(AuthenticatedGuard)
  @Get(':teamId/members')
  async members(@Param('teamId') teamId: string): Promise<AbstractResponseDto<TeamUser[]>> {
    const data = await teamsManager.getMembersByTeamId(teamId);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':teamId/members/:userId')
  async deleteMember(
    @Req() req: Request,
    @Param('teamId') teamId: string,
    @Param('userId') userId: string
  ): Promise<AbstractResponseDto<TeamUser>> {
    const data = await teamsManager.removeMemberFromTeam(req.user.id, userId, teamId);

    return {
      success: true,
      data,
    };
  }

  // Joined
  @UseGuards(AuthenticatedGuard)
  @Get('joined')
  async joined(@Req() req: Request): Promise<AbstractResponseDto<JoinedTeam | null>> {
    const data = await teamsManager.getJoinedTeamByUserId(req.user.id);

    return {
      success: true,
      data: data as unknown as JoinedTeam,
    };
  }
}
