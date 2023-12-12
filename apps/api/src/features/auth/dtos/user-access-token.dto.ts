import { UserAccessTokenSchema } from '@myzenbuddy/shared-common';

import { createZodDto } from '../../core/utils/validation-helpers';

export class UserAccessTokenDto extends createZodDto(UserAccessTokenSchema) {}
