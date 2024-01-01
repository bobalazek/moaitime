import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { getClientIp } from 'request-ip';

import { WeatherInterface } from '@moaitime/shared-common';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/weather')
export class WeatherController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async view(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AbstractResponseDto<WeatherInterface>> {
    if (!req.user.settings?.weatherLocation) {
      throw new Error(`Weather location is not set`);
    }

    const data: WeatherInterface = {
      time: new Date().toISOString(),
      location: req.user.settings.weatherLocation,
      conditions: 'Clear',
      temperatureCelsius: 0,
      windSpeedKilometersPerHour: 0,
    };

    res.status(200);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('location')
  async location(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AbstractResponseDto<string>> {
    // TODO: implement - determine location from latitude and longitude
    //const latitude = req.query.latitude as string;
    //const longitude = req.query.longitude as string;

    const clientIp = getClientIp(req);
    if (!clientIp) {
      throw new Error(`Location could not be determined`);
    }

    const response = await fetch(
      `http://ip-api.com/json/${clientIp}?fields=status,message,district,city,regionName,country,lat,lon,timezone`
    );
    const json = await response.json();
    if (json.status === 'fail') {
      throw new Error(`Location could not be determined`);
    }

    const data = `${json.city}, ${json.regionName}, ${json.country}`;

    res.status(200);

    return {
      success: true,
      data,
    };
  }
}
