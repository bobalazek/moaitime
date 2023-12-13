import { RegisterUserSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../core/utils/validation-helpers';

export class RegisterDto extends createZodDto(RegisterUserSchema) {}
