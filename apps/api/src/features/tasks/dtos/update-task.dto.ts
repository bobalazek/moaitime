import { UpdateTaskSchema } from '@myzenbuddy/shared-common';

import { createZodDto } from '../../core/utils/validation-helpers';

export class UpdateTaskDto extends createZodDto(UpdateTaskSchema) {}
