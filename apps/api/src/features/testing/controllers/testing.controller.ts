import { testingEmailsManager } from '@moaitime/database-services-testing';
import { reloadDatabase } from '@moaitime/database-testing';
import { getEnv } from '@moaitime/shared-backend';
import { Controller, Get, Post } from '@nestjs/common';

import { ResponseDto } from '../../core/dtos/responses/response.dto';

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
