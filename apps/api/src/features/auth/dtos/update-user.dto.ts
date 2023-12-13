import { UpdateUserSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../core/utils/validation-helpers';

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
