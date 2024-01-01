import { RegisterUserSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class RegisterDto extends createZodDto(RegisterUserSchema) {}
