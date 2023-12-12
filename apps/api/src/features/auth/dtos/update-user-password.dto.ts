import { UpdateUserPasswordSchema } from '@myzenbuddy/shared-common';

import { createZodDto } from '../../core/utils/validation-helpers';

export class UpdateUserPasswordDto extends createZodDto(UpdateUserPasswordSchema) {}
