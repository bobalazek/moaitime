import { UpdateUserPasswordSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../core/utils/validation-helpers';

export class UpdateUserPasswordDto extends createZodDto(UpdateUserPasswordSchema) {}
