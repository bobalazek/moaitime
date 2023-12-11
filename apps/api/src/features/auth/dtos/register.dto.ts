import { createZodDto } from 'nestjs-zod';

import { UserRegisterSchema } from '@myzenbuddy/shared-common';

export class RegisterDto extends createZodDto(UserRegisterSchema) {}
