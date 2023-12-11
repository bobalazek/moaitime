import { createZodDto } from 'nestjs-zod';

import { UserAccessTokenSchema } from '@myzenbuddy/shared-common';

export class UserAccessTokenDto extends createZodDto(UserAccessTokenSchema) {}
