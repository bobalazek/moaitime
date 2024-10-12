import { CreateGoalSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class CreateGoalDto extends createZodDto(CreateGoalSchema) {}
