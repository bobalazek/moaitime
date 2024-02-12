import { PublicUserSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class PublicUserDto extends createZodDto(PublicUserSchema) {}
