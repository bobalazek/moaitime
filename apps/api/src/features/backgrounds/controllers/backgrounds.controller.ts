import { Controller, Get, UseGuards } from '@nestjs/common';

import { Background } from '@moaitime/database-core';
import { backgroundsManager } from '@moaitime/database-services';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/backgrounds')
export class BackgroundsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(): Promise<AbstractResponseDto<Background[]>> {
    const data = await backgroundsManager.findMany();

    return {
      success: true,
      data,
    };
  }
}
