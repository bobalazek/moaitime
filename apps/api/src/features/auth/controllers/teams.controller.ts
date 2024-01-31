import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { Team, TeamUser, TeamUserInvitation } from '@moaitime/database-core';
import { teamsManager } from '@moaitime/database-services';

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
    const data = await teamsManager.list(req.user.id);

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
    const data = await teamsManager.createAndJoin(req.user, body.name);

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
    const data = await teamsManager.update(req.user.id, teamId, body);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':teamId')
  async delete(
    @Req() req: Request,
    @Param('teamId') teamId: string,
    @Body() body: DeleteDto
  ): Promise<AbstractResponseDto<Team>> {
    const data = await teamsManager.delete(req.user.id, teamId, body.isHardDelete);

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
    const data = await teamsManager.undelete(req.user.id, teamId);

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
    const data = await teamsManager.leave(req.user.id, teamId);

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
}