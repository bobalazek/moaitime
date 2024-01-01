import { CreateNoteSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class CreateNoteDto extends createZodDto(CreateNoteSchema) {}
