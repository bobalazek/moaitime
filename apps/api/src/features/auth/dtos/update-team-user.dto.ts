import { UpdateTeamUserSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class UpdateTeamUserDto extends createZodDto(UpdateTeamUserSchema) {}
