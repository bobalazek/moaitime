import { Controller, Get } from '@nestjs/common';

import { Background } from '@myzenbuddy/database-core';
import { backgroundsManager } from '@myzenbuddy/database-services';

import { AbstractResponseDto } from '../../core/dtos/responses/abstract-response.dto';

@Controller('/api/v1/backgrounds')
export class BackgroundsController {
  @Get()
  async list(): Promise<AbstractResponseDto<Background[]>> {
    const data = await backgroundsManager.findMany();

    return {
      success: true,
      data,
    };
  }
}
