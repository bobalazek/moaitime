import { CreateTaskSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class CreateTaskDto extends createZodDto(CreateTaskSchema) {}
