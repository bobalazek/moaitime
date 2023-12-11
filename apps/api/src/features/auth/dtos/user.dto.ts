import { createZodDto } from 'nestjs-zod';

import { UserSchema } from '@myzenbuddy/shared-common';

export class UserDto extends createZodDto(UserSchema) {}
