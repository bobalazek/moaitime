import { UserSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class UserDto extends createZodDto(UserSchema) {}
