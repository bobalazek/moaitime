import { UpdateNoteSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../core/utils/validation-helpers';

export class UpdateNoteDto extends createZodDto(UpdateNoteSchema) {}
