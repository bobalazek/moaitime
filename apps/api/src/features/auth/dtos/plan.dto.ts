import { PlanSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class PlanDto extends createZodDto(PlanSchema) {}
