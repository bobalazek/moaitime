import { Controller, Post } from '@nestjs/common';

import { reloadDatabase } from '@myzenbuddy/database-testing';

import { ResponseDto } from '../../core/dtos/response.dto';

@Controller('/api/testing')
export class TestingController {
  @Post('reload-database')
  async reloadDatabase(): Promise<ResponseDto> {
    await reloadDatabase();

    return {
      success: true,
    };
  }
}
