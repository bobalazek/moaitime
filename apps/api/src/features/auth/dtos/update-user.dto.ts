import { UpdateUserSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
