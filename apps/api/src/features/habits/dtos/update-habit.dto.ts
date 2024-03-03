import { UpdateHabitSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class UpdateHabitDto extends createZodDto(UpdateHabitSchema) {}
