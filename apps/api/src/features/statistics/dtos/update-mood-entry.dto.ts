import { UpdateMoodEntrySchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class UpdateMoodEntryDto extends createZodDto(UpdateMoodEntrySchema) {}
