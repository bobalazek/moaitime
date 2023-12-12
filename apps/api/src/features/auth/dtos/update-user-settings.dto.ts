import { UpdateUserSettingsSchema } from '@myzenbuddy/shared-common';

import { createZodDto } from '../../core/utils/validation-helpers';

export class UpdateUserSettingsDto extends createZodDto(UpdateUserSettingsSchema) {}
