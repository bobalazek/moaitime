import { UpdateListSchema } from '@myzenbuddy/shared-common';

import { createZodDto } from '../../core/utils/validation-helpers';

export class UpdateListDto extends createZodDto(UpdateListSchema) {}
