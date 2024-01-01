import { UpdateTaskSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class UpdateTaskDto extends createZodDto(UpdateTaskSchema) {}
