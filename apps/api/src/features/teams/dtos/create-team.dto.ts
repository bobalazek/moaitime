import { CreateTeamSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class CreateTeamDto extends createZodDto(CreateTeamSchema) {}
