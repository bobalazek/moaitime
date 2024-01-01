import { CreateCalendarSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class CreateCalendarDto extends createZodDto(CreateCalendarSchema) {}
