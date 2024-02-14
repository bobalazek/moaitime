import { Controller, Post, UseGuards } from '@nestjs/common';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../guards/authenticated.guard';

@Controller('/api/v1/ping')
export class PingController {
  @UseGuards(AuthenticatedGuard)
  @Post()
  async index(): Promise<AbstractResponseDto> {
    return {
      success: true,
      data: {
        pong: true,
      },
    };
  }
}
