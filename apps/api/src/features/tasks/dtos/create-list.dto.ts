import { CreateListSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../core/utils/validation-helpers';

export class CreateListDto extends createZodDto(CreateListSchema) {}
