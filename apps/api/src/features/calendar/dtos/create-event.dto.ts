import { CreateEventSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../core/utils/validation-helpers';

export class CreateEventDto extends createZodDto(CreateEventSchema) {}
