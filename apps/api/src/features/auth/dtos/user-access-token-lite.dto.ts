import { UserAccessTokenLiteSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class UserAccessTokenLiteDto extends createZodDto(UserAccessTokenLiteSchema) {}
