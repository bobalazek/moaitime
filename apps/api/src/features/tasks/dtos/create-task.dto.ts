import { CreateTaskSchema } from '@myzenbuddy/shared-common';

import { createZodDto } from '../../core/utils/validation-helpers';

export class CreateTaskDto extends createZodDto(CreateTaskSchema) {
  name!: string;
  order!: number;
  listId!: string;
  description?: string;
  priority?: number;
}
