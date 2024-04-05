import { AbstractResponseDto } from '../../../../dtos/responses/abstract-response.dto';
import { PlanDto } from '../plan.dto';
import { SubscriptionDto } from '../subscription.dto';
import { BaseUserAccessTokenDto } from '../user-access-token-lite.dto';
import { UserDto } from '../user.dto';

export class LoginResponseDto extends AbstractResponseDto<{
  user: UserDto;
  userAccessToken: BaseUserAccessTokenDto;
  plan: PlanDto | null;
  subscription: SubscriptionDto | null;
}> {}
