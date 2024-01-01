import { CreateListSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class CreateListDto extends createZodDto(CreateListSchema) {}
