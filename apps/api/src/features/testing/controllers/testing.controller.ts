import { Controller, Get, Post } from '@nestjs/common';

import { testingEmailsManager } from '@myzenbuddy/database-services-testing';
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

  @Get('emails/newest')
  async emailsNewest(): Promise<ResponseDto> {
    if (getEnv().NODE_ENV !== 'test') {
      return {
        success: false,
        message: 'This endpoint can only be used in test environment',
      };
    }

    const email = await testingEmailsManager.findOneNewest();

    return {
      success: true,
      data: email,
    };
  }
}
