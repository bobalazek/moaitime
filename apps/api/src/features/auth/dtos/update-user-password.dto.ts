import { createZodDto } from 'nestjs-zod';

import { UpdateUserPasswordSchema } from '@myzenbuddy/shared-common';

export class UpdateUserPasswordDto extends createZodDto(UpdateUserPasswordSchema) {}
