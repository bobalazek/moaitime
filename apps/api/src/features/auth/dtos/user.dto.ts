import { UserSchema } from '@myzenbuddy/shared-common';

import { createZodDto } from '../../core/utils/validation-helpers';

export class UserDto extends createZodDto(UserSchema) {}
