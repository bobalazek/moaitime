import { createZodDto } from 'nestjs-zod';

import { UserSettingsSchema } from '@myzenbuddy/shared-common';

export class UpdateUserSettingsDto extends createZodDto(UserSettingsSchema) {}
