import { UpdateCalendarSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../core/utils/validation-helpers';

export class UpdateCalendarDto extends createZodDto(UpdateCalendarSchema) {}
