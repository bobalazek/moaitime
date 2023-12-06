import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { authManager } from '@myzenbuddy/database-services';

import { ResponseDto } from '../../core/dtos/response.dto';
import { TokenDto } from '../../core/dtos/token.dto';
import { ConfirmEmailDto } from '../dtos/confirm-email.dto';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { RequestPasswordResetDto } from '../dtos/request-password-reset.dto';
import { ResendEmailConfirmationDto } from '../dtos/resend-email-confirmation.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { AuthenticatedGuard } from '../guards/authenticated.guard';
import { convertToUserAndAccessTokenDto } from '../utils/auth.utils';

@Controller('/api/v1/auth')
export class AuthController {
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<LoginResponseDto> {
    const { user, userAccessToken } = await authManager.login(body.email, body.password);

    res.status(200);

    return {
      success: true,
      message: 'Successfully logged in',
      data: convertToUserAndAccessTokenDto(user, userAccessToken),
    };
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseDto> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!req.user) {
      return {
        success: false,
      };
    }

    const success = await authManager.logout(req.user._accessToken.token);

    res.status(200);

    return {
      success,
      message: success ? 'Successfully logged out' : 'Failed to log out',
    };
  }

  @Post('register')
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<LoginResponseDto> {
    await authManager.register(body);

    const { user, userAccessToken } = await authManager.login(body.email, body.password);

    res.status(200);

    return {
      success: true,
      message: 'Successfully registered',
      data: convertToUserAndAccessTokenDto(user, userAccessToken),
    };
  }

  @Post('resend-email-confirmation')
  async resendEmailConfirmation(
    @Body() body: ResendEmailConfirmationDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseDto> {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    await authManager.resendEmailConfirmation(req.user.id, !!body.isNewEmail);

    res.status(200);

    return {
      success: true,
      message: 'Successfully resent email confirmation',
    };
  }

  @Post('cancel-new-email')
  async cancelNewEmail(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseDto> {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    await authManager.cancelNewEmail(req.user.id);

    res.status(200);

    return {
      success: true,
      message: 'Successfully cancelled new email',
    };
  }

  @Post('confirm-email')
  async confirmEmail(
    @Body() body: ConfirmEmailDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseDto> {
    await authManager.confirmEmail(body.token, !!body.isNewEmail);

    res.status(200);

    return {
      success: true,
      message: 'Successfully confirmed the email address!',
    };
  }

  @Post('request-password-reset')
  async requestPasswordReset(
    @Body() body: RequestPasswordResetDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseDto> {
    await authManager.requestPasswordReset(body.email);

    res.status(200);

    return {
      success: true,
      message: 'Successfully requested password reset',
    };
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: ResetPasswordDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseDto> {
    await authManager.resetPassword(body.token, body.password);

    res.status(200);

    return {
      success: true,
      message: 'Successfully reset password',
    };
  }

  @Post('refresh-token')
  async refreshToken(
    @Body() body: TokenDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<LoginResponseDto> {
    const { user, userAccessToken } = await authManager.refreshToken(body.token);

    res.status(200);

    return {
      success: true,
      message: 'Successfully refreshed token',
      data: convertToUserAndAccessTokenDto(user, userAccessToken),
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  async me(
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
}
