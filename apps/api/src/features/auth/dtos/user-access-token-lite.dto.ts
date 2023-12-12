import { UserAccessTokenLiteSchema } from '@myzenbuddy/shared-common';

import { createZodDto } from '../../core/utils/validation-helpers';

export class UserAccessTokenLiteDto extends createZodDto(UserAccessTokenLiteSchema) {}
