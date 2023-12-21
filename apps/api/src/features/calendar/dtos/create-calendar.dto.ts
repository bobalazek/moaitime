import { CreateCalendarSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../core/utils/validation-helpers';

export class CreateCalendarDto extends createZodDto(CreateCalendarSchema) {}
