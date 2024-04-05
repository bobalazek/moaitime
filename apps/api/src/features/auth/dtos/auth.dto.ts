import { AuthSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class AuthDto extends createZodDto(AuthSchema) {}
