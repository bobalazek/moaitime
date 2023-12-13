import { UpdateTaskSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../core/utils/validation-helpers';

export class UpdateTaskDto extends createZodDto(UpdateTaskSchema) {}
