import { UpdateUserSettingsSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class UpdateUserSettingsDto extends createZodDto(UpdateUserSettingsSchema) {}
