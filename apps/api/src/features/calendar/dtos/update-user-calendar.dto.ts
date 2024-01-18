import { UpdateUserCalendarSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class UpdateUserCalendarDto extends createZodDto(UpdateUserCalendarSchema) {}
