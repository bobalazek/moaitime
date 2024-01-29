import { UpdateTeamSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class UpdateTeamDto extends createZodDto(UpdateTeamSchema) {}
