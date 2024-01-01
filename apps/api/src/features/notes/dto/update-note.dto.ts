import { UpdateNoteSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class UpdateNoteDto extends createZodDto(UpdateNoteSchema) {}
