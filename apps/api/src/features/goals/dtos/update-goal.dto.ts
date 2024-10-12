import { UpdateGoalSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class UpdateGoalDto extends createZodDto(UpdateGoalSchema) {}
