import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';

import { authManager, userUsageManager } from '@moaitime/database-services';
import { ResponseInterface, UserLimits, UserUsage } from '@moaitime/shared-common';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthDto } from '../dtos/auth.dto';
import { UpdateUserPasswordDto } from '../dtos/update-user-password.dto';
import { UpdateUserSettingsDto } from '../dtos/update-user-settings.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { AuthenticatedGuard } from '../guards/authenticated.guard';
import { convertUserToAuthDto } from '../utils/auth.utils';

@Controller('/api/v1/account')
export class AccountController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async index(@Req() req: Request): Promise<AbstractResponseDto<AuthDto>> {
    const data = convertUserToAuthDto(req.user);

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
  ): Promise<AbstractResponseDto<AuthDto>> {
    await authManager.update(req.user.id, body);

    return this._getUpdatedUserAndAccessTokenResponse(req.user._accessToken.token, res);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('password')
  async password(
    @Body() body: UpdateUserPasswordDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AbstractResponseDto<AuthDto>> {
    await authManager.updatePassword(req.user.id, body.newPassword, body.currentPassword);

    return this._getUpdatedUserAndAccessTokenResponse(req.user._accessToken.token, res);
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('settings')
  async updateSettings(
    @Body() body: UpdateUserSettingsDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AbstractResponseDto<AuthDto>> {
    await authManager.updateSettings(req.user.id, body);

    return this._getUpdatedUserAndAccessTokenResponse(req.user._accessToken.token, res);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async avatar(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 4096,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        })
    )
    file: { originalname: string; mimetype: string; buffer: Buffer }, // We can not use the Express.Multer.File for some reason
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AbstractResponseDto<AuthDto>> {
    await authManager.uploadAvatar(req.user.id, file);

    return this._getUpdatedUserAndAccessTokenResponse(req.user._accessToken.token, res);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('avatar')
  async deleteAvatar(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AbstractResponseDto<AuthDto>> {
    await authManager.deleteAvatar(req.user.id);

    return this._getUpdatedUserAndAccessTokenResponse(req.user._accessToken.token, res);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('limits')
  async limits(@Req() req: Request): Promise<ResponseInterface<UserLimits>> {
    const data = await userUsageManager.getUserLimits(req.user);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('usage')
  async usage(@Req() req: Request): Promise<ResponseInterface<UserUsage>> {
    const data = await userUsageManager.getUserUsage(req.user);

    return {
      success: true,
      data,
    };
  }

  // Private
  private async _getUpdatedUserAndAccessTokenResponse(
    token: string,
    res: Response
  ): Promise<AbstractResponseDto<AuthDto>> {
    const userWithAccessToken = await authManager.getUserByAccessToken(token);
    if (!userWithAccessToken) {
      throw new UnauthorizedException();
    }

    res.status(200);

    return {
      success: true,
      data: convertUserToAuthDto({
        ...userWithAccessToken.user,
        _accessToken: userWithAccessToken.userAccessToken,
      }),
    };
  }
}
