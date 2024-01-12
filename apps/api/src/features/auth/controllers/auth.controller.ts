import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { authManager } from '@moaitime/database-services';

import { ResponseDto } from '../../../dtos/responses/response.dto';
import { TokenDto } from '../../../dtos/token.dto';
import { ConfirmEmailDto } from '../dtos/confirm-email.dto';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { RequestPasswordResetDto } from '../dtos/request-password-reset.dto';
import { ResendEmailConfirmationDto } from '../dtos/resend-email-confirmation.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { LoginResponseDto } from '../dtos/responses/login-response.dto';
import { convertToUserDto } from '../utils/auth.utils';

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
      message: 'You have successfully logged in',
      data: convertToUserDto({ ...user, _accessToken: userAccessToken }),
    };
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseDto> {
    if (!req.user) {
      return {
        success: false,
      };
    }

    const success = await authManager.logout(req.user._accessToken.token);

    res.status(200);

    return {
      success,
      message: success ? 'You have successfully logged out' : 'Failed to log out',
    };
  }

  @Post('register')
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<LoginResponseDto> {
    await authManager.register({
      // I really do not feel like fighting with typescript on this one now.
      // That shall be a problem for future me.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      settings: body.settings as any,
      ...body,
    });

    const { user, userAccessToken } = await authManager.login(body.email, body.password);

    res.status(200);

    return {
      success: true,
      message: 'You have successfully registered',
      data: convertToUserDto({ ...user, _accessToken: userAccessToken }),
    };
  }

  @Post('resend-email-confirmation')
  async resendEmailConfirmation(
    @Body() body: ResendEmailConfirmationDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseDto> {
    await authManager.resendEmailConfirmation(req.user.id, !!body.isNewEmail);

    res.status(200);

    return {
      success: true,
      message: 'You have successfully resent the email confirmation',
    };
  }

  @Post('cancel-new-email')
  async cancelNewEmail(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseDto> {
    await authManager.cancelNewEmail(req.user.id);

    res.status(200);

    return {
      success: true,
      message: 'You have successfully cancelled the new email',
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
      message: 'You have successfully confirmed your email address!',
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
      message: 'You have successfully requested password reset',
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
      message: 'You have successfully reset your password',
    };
  }

  @Post('request-account-deletion')
  async requestAccountDeletion(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseDto> {
    if (!req.user) {
      return {
        success: false,
      };
    }

    await authManager.requestAccountDeletion(req.user.id);

    res.status(200);

    return {
      success: true,
      message:
        'You have successfully requested the accont deletion. Check your email and click the link to confirm.',
    };
  }

  @Post('delete-account')
  async deleteAccount(
    @Body() body: TokenDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseDto> {
    await authManager.deleteAccount(body.token);

    res.status(200);

    return {
      success: true,
      message: 'You have successfully deleted your account',
    };
  }

  @Post('request-data-export')
  async requestDataExport(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseDto> {
    if (!req.user) {
      return {
        success: false,
      };
    }

    await authManager.requestDataExport(req.user.id);

    res.status(200);

    return {
      success: true,
      message:
        'You have successfully requested the data export. This will take a couple of hours. Once done, you will get an email with the download link.',
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
      message: 'You have successfully refreshed your token',
      data: convertToUserDto({ ...user, _accessToken: userAccessToken }),
    };
  }
}
