import { UpdateEventSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class UpdateEventDto extends createZodDto(UpdateEventSchema) {}
