import { UpdateEventSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../core/utils/validation-helpers';

export class UpdateEventDto extends createZodDto(UpdateEventSchema) {}
