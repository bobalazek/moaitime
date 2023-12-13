import { UpdateUserSettingsSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../core/utils/validation-helpers';

export class UpdateUserSettingsDto extends createZodDto(UpdateUserSettingsSchema) {}
