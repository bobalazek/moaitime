import {
  Body,
  Controller,
  Patch,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { authManager } from '@myzenbuddy/database-services';

import { LoginResponseDto } from '../dtos/login-response.dto';
import { UpdateUserSettingsDto } from '../dtos/update-user-settings.dto';
import { AuthenticatedGuard } from '../guards/authenticated.guard';
import { convertToUserAndAccessTokenDto } from '../utils/auth.utils';

@Controller('/api/v1/auth/settings')
export class AuthSettingsController {
  @UseGuards(AuthenticatedGuard)
  @Patch()
  async update(
    @Body() body: UpdateUserSettingsDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<LoginResponseDto> {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    await authManager.updateSettings(req.user.id, body);

    const userWithAccessToken = await authManager.getUserByAccessToken(req.user._accessToken.token);
    if (!userWithAccessToken) {
      throw new UnauthorizedException();
    }

    res.status(200);

    return {
      success: true,
      data: convertToUserAndAccessTokenDto(
        userWithAccessToken.user,
        userWithAccessToken.userAccessToken
      ),
    };
  }
}
