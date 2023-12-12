import { CreateListSchema } from '@myzenbuddy/shared-common';

import { createZodDto } from '../../core/utils/validation-helpers';

export class CreateListDto extends createZodDto(CreateListSchema) {
  name!: string;
  color?: string;
}
