import { CreateEventSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class CreateEventDto extends createZodDto(CreateEventSchema) {}
