import { UpdateCalendarSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class UpdateCalendarDto extends createZodDto(UpdateCalendarSchema) {}
