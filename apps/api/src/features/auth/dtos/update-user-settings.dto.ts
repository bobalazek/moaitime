import { createZodDto } from 'nestjs-zod';

import { UpdateUserSettingsSchema } from '@myzenbuddy/shared-common';

export class UpdateUserSettingsDto extends createZodDto(UpdateUserSettingsSchema) {}
