import { BaseUserAccessTokenSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class BaseUserAccessTokenDto extends createZodDto(BaseUserAccessTokenSchema) {}
