import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { authManager, usersManager } from '@moaitime/database-services';
import { ResponseInterface, UserLimits, UserUsage } from '@moaitime/shared-common';

import { LoginResponseDto } from '../dtos/responses/login-response.dto';
import { UpdateUserPasswordDto } from '../dtos/update-user-password.dto';
import { UpdateUserSettingsDto } from '../dtos/update-user-settings.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { AuthenticatedGuard } from '../guards/authenticated.guard';
import { convertToUserDto } from '../utils/auth.utils';

@Controller('/api/v1/account')
export class AccountController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async index(@Req() req: Request): Promise<LoginResponseDto> {
    const data = convertToUserDto(req.user);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Patch()
  async update(
    @Body() body: UpdateUserDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<LoginResponseDto> {
    await authManager.update(req.user.id, body);

    return this._getUpdatedUserAndAccessTokenResponse(req.user._accessToken.token, res);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('password')
  async password(
    @Body() body: UpdateUserPasswordDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<LoginResponseDto> {
    await authManager.updatePassword(req.user.id, body.newPassword, body.currentPassword);

    return this._getUpdatedUserAndAccessTokenResponse(req.user._accessToken.token, res);
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('settings')
  async updateSettings(
    @Body() body: UpdateUserSettingsDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<LoginResponseDto> {
    await authManager.updateSettings(req.user.id, body);

    return this._getUpdatedUserAndAccessTokenResponse(req.user._accessToken.token, res);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('limits')
  async limits(@Req() req: Request): Promise<ResponseInterface<UserLimits>> {
    const data = await usersManager.getUserLimits(req.user);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('usage')
  async usage(@Req() req: Request): Promise<ResponseInterface<UserUsage>> {
    const data = await usersManager.getUserUsage(req.user);

    return {
      success: true,
      data,
    };
  }

  // Private
  private async _getUpdatedUserAndAccessTokenResponse(
    token: string,
    res: Response
  ): Promise<LoginResponseDto> {
    const userWithAccessToken = await authManager.getUserByAccessToken(token);
    if (!userWithAccessToken) {
      throw new UnauthorizedException();
    }

    res.status(200);

    return {
      success: true,
      data: convertToUserDto({
        ...userWithAccessToken.user,
        _accessToken: userWithAccessToken.userAccessToken,
      }),
    };
  }
}
