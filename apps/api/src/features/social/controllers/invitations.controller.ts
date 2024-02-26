import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { invitationsManager } from '@moaitime/database-services';

import { EmailDto } from '../../../dtos/email.dto';
import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/invitations')
export class InvitationsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto> {
    const data = await invitationsManager.list(req.user.id);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(@Req() req: Request, @Body() body: EmailDto): Promise<AbstractResponseDto> {
    const data = await invitationsManager.create(req.user.id, body.email);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':invitationId')
  async delete(
    @Req() req: Request,
    @Param('invitationId') invitationId: string
  ): Promise<AbstractResponseDto> {
    const data = await invitationsManager.delete(req.user.id, invitationId);

    return {
      success: true,
      data,
    };
  }
}
