import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { statisticsManager } from '@moaitime/database-services';
import { ResponseInterface, StatisticsGeneralBasicData } from '@moaitime/shared-common';

import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/statistics')
export class StatisticsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async index(@Req() req: Request): Promise<ResponseInterface<StatisticsGeneralBasicData>> {
    const data = await statisticsManager.getGeneral(req.user);

    return {
      success: true,
      data,
    };
  }
}
