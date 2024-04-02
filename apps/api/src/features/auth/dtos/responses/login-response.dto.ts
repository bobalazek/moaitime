import { AbstractResponseDto } from '../../../../dtos/responses/abstract-response.dto';
import { BaseUserAccessTokenDto } from '../user-access-token-lite.dto';
import { UserDto } from '../user.dto';

export class LoginResponseDto extends AbstractResponseDto<{
  user: UserDto;
  userAccessToken: BaseUserAccessTokenDto;
}> {}
