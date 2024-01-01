import { UpdateUserPasswordSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class UpdateUserPasswordDto extends createZodDto(UpdateUserPasswordSchema) {}
