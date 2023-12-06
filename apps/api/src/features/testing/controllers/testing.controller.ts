import { Controller, Post } from '@nestjs/common';

import { reloadDatabase } from '@myzenbuddy/database-testing';
import { getEnv } from '@myzenbuddy/shared-backend';

import { ResponseDto } from '../../core/dtos/response.dto';

@Controller('/api/testing')
export class TestingController {
  @Post('reload-database')
  async reloadDatabase(): Promise<ResponseDto> {
    if (getEnv().NODE_ENV !== 'test') {
      return {
        success: false,
        message: 'This endpoint can only be used in test environment',
      };
    }

    await reloadDatabase();

    return {
      success: true,
    };
  }
}
