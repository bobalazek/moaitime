import { CreateMoodEntrySchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class CreateMoodEntryDto extends createZodDto(CreateMoodEntrySchema) {}
