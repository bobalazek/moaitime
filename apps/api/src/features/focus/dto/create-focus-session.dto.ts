import { CreateFocusSessionSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class CreateFocusSessionDto extends createZodDto(CreateFocusSessionSchema) {}
