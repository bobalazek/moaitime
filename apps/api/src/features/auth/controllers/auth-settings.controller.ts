import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { authManager } from '@myzenbuddy/database-services';

import { UpdateUserDto } from '../../users/dtos/update-user.dto';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { UpdatePasswordDto } from '../dtos/update-password.dto';
import { AuthenticatedGuard } from '../guards/authenticated.guard';
import { convertToUserAndAccessTokenDto } from '../utils/auth.utils';

@Controller('/api/v1/auth/settings')
export class AuthSettingsController {
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
