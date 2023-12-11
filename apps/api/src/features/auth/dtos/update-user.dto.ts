import { createZodDto } from 'nestjs-zod';

import { UpdateUserSchema } from '@myzenbuddy/shared-common';

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
