import { AbstractResponseDto } from '../../core/dtos/abstract-response.dto';
import { UserAccessTokenDto } from '../../users/dtos/user-access-token.dto';
import { UserDto } from '../../users/dtos/user.dto';

export class LoginResponseDto extends AbstractResponseDto<{
  user: UserDto;
  userAccessToken: UserAccessTokenDto;
}> {}
