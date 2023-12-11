import { AbstractResponseDto } from '../../core/dtos/abstract-response.dto';
import { UserAccessTokenDto } from './user-access-token.dto';
import { UserDto } from './user.dto';

export class LoginResponseDto extends AbstractResponseDto<{
  user: UserDto;
  userAccessToken: UserAccessTokenDto;
}> {}
