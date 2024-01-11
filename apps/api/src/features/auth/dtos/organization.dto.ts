import { OrganizationSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class OrganizationDto extends createZodDto(OrganizationSchema) {}
