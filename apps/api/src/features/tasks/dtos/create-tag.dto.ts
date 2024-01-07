import { CreateTagSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class CreateTagDto extends createZodDto(CreateTagSchema) {}
