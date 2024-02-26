import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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
  async invite(@Req() req: Request, @Body() body: EmailDto): Promise<AbstractResponseDto> {
    const data = await invitationsManager.invite(req.user.id, body.email);

    return {
      success: true,
      data,
    };
  }
}
