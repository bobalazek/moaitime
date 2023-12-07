import { Controller, Get, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { List } from '@myzenbuddy/database-core';
import { listsManager } from '@myzenbuddy/database-services';

import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { AbstractResponseDto } from '../../core/dtos/abstract-response.dto';

@Controller('/api/v1/lists')
export class ListsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async index(@Req() req: Request): Promise<AbstractResponseDto<List[]>> {
    if (!req.user) {
      throw new UnauthorizedException();
    }
    const data = await listsManager.findManyByUserId(req.user.id);

    return {
      success: true,
      data,
    };
  }
}
