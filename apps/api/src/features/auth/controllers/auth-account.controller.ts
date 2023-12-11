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

import { authManager } from '@myzenbuddy/database-services';

import { LoginResponseDto } from '../dtos/login-response.dto';
import { UpdatePasswordDto } from '../dtos/update-password.dto';
import { UpdateUserSettingsDto } from '../dtos/update-user-settings.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { AuthenticatedGuard } from '../guards/authenticated.guard';
import { convertToUserAndAccessTokenDto } from '../utils/auth.utils';

@Controller('/api/v1/auth/account')
export class AuthAccountController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async index(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<LoginResponseDto> {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    res.status(200);

    return {
      success: true,
      data: convertToUserAndAccessTokenDto(req.user, req.user._accessToken),
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Patch()
  async update(
    @Body() body: UpdateUserDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<LoginResponseDto> {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    await authManager.update(req.user.id, body);

    return this._getUpdatedUserAndAccessTokenResponse(req.user._accessToken.token, res);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('password')
  async password(
    @Body() body: UpdatePasswordDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<LoginResponseDto> {
    if (!req.user) {
      throw new UnauthorizedException();
    }

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
    if (!req.user) {
      throw new UnauthorizedException();
    }

    await authManager.updateSettings(req.user.id, body);

    return this._getUpdatedUserAndAccessTokenResponse(req.user._accessToken.token, res);
  }

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
      data: convertToUserAndAccessTokenDto(
        userWithAccessToken.user,
        userWithAccessToken.userAccessToken
      ),
    };
  }
}
