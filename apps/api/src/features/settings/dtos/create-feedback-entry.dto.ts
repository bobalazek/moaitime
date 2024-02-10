import { CreateFeedbackEntrySchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class CreateFeedbackEntryDto extends createZodDto(CreateFeedbackEntrySchema) {}
