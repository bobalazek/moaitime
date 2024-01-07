import { UpdateTagSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class UpdateTagDto extends createZodDto(UpdateTagSchema) {}
