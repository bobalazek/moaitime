import { TeamSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class TeamDto extends createZodDto(TeamSchema) {}
