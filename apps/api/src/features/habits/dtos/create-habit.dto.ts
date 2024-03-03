import { CreateHabitSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class CreateHabitDto extends createZodDto(CreateHabitSchema) {}
