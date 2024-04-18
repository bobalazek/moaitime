import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { RealIP } from 'nestjs-real-ip';

import { authManager } from '@moaitime/database-services';
import { OauthProviderEnum, UserPasswordlessLoginSchema } from '@moaitime/shared-common';

import { EmailDto } from '../../../dtos/email.dto';
import { OauthTokenDto } from '../../../dtos/oauth-token.dto';
import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { ResponseDto } from '../../../dtos/responses/response.dto';
import { TokenDto } from '../../../dtos/token.dto';
import { AuthDto } from '../dtos/auth.dto';
import { ConfirmEmailDto } from '../dtos/confirm-email.dto';
import { LoginDto } from '../dtos/login.dto';
import { PasswordlessLoginDto } from '../dtos/passwordless-login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { RequestPasswordResetDto } from '../dtos/request-password-reset.dto';
import { ResendEmailConfirmationDto } from '../dtos/resend-email-confirmation.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { AuthenticatedGuard } from '../guards/authenticated.guard';
import { convertUserToAuthDto } from '../utils/auth.utils';

@Controller('/api/v1/auth')
export class AuthController {
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @RealIP() ip: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AbstractResponseDto<AuthDto>> {
    const userAgent = req.get('user-agent');
    const deviceUid = req.get('device-uid');

    const { user, userAccessToken } = await authManager.loginWithCredentials(
      body.email,
      body.password,
      userAgent,
      deviceUid,
      ip
    );

    res.status(200);

    return {
      success: true,
      message: 'You have successfully logged in',
      data: convertUserToAuthDto({ ...user, _accessToken: userAccessToken }),
    };
  }

  @Post('request-passwordless-login')
  async requestPasswordlessLogin(
    @Body() body: EmailDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseDto> {
    await authManager.requestPasswordlessLogin(body.email);

    res.status(200);

    return {
      success: true,
      message:
        'You have successfully requested the passwordless login. Check your email for the code',
    };
  }

  @Post('passwordless-login')
  async passwordlessLogin(
    @Body() body: PasswordlessLoginDto,
    @RealIP() ip: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AbstractResponseDto<AuthDto>> {
    const userAgent = req.get('user-agent');
    const deviceUid = req.get('device-uid');

    const { user, userAccessToken } = await authManager.passwordlessLogin(
      body.token,
      body.code,
      userAgent,
      deviceUid,
      ip
    );

    res.status(200);

    return {
      success: true,
      message: 'You have successfully logged in',
      data: convertUserToAuthDto({ ...user, _accessToken: userAccessToken }),
    };
  }

  @Get('passwordless-login/:token')
  async checkPasswordlessLogin(@Param('token') token: string): Promise<ResponseDto> {
    const userPasswordlessLogin = await authManager.checkPasswordlessLogin(token);

    const userPasswordlessLoginDto = UserPasswordlessLoginSchema.parse(userPasswordlessLogin);

    return {
      success: true,
      data: userPasswordlessLoginDto,
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

  @Post('oauth/:provider/login')
  async oauthLogin(
    @Param('provider') provider: OauthProviderEnum,
    @Body() body: OauthTokenDto,
    @RealIP() ip: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AbstractResponseDto<AuthDto>> {
    const userAgent = req.get('user-agent');
    const deviceUid = req.get('device-uid');

    const { user, userAccessToken } = await authManager.oauthLogin(
      provider,
      body,
      userAgent,
      deviceUid,
      ip
    );

    res.status(200);

    return {
      success: true,
      message: 'You have successfully logged in',
      data: convertUserToAuthDto({ ...user, _accessToken: userAccessToken }),
    };
  }

  @Post('oauth/:provider/user-info')
  async oauthUserInfo(
    @Param('provider') provider: OauthProviderEnum,
    @Body() body: OauthTokenDto
  ): Promise<ResponseDto> {
    const data = await authManager.oauthUserInfo(provider, body);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post('oauth/:provider/link')
  async oauthLink(
    @Param('provider') provider: OauthProviderEnum,
    @Body() body: OauthTokenDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseDto> {
    await authManager.oauthLink(req.user.id, provider, body);

    res.status(200);

    return {
      success: true,
      message: 'You have successfully linked your account',
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post('oauth/:provider/unlink')
  async oauthUnlink(
    @Param('provider') provider: OauthProviderEnum,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<ResponseDto> {
    await authManager.oauthUnlink(req.user.id, provider);

    res.status(200);

    return {
      success: true,
      message: 'You have successfully unlinked your account',
    };
  }

  @Post('register')
  async register(
    @Body() body: RegisterDto,
    @RealIP() ip: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AbstractResponseDto<AuthDto>> {
    const userAgent = req.get('user-agent');
    const deviceUid = req.get('device-uid');

    const registeredUser = await authManager.register({
      settings: body.settings,
      ...body,
    });

    const { user, userAccessToken } = await authManager.loginWithUserId(
      registeredUser.id,
      userAgent,
      deviceUid,
      ip
    );

    res.status(200);

    return {
      success: true,
      message: 'You have successfully registered',
      data: convertUserToAuthDto({ ...user, _accessToken: userAccessToken }),
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
  ): Promise<AbstractResponseDto<AuthDto>> {
    const { user, userAccessToken } = await authManager.refreshToken(body.token);

    res.status(200);

    return {
      success: true,
      message: 'You have successfully refreshed your token',
      data: convertUserToAuthDto({ ...user, _accessToken: userAccessToken }),
    };
  }
}
