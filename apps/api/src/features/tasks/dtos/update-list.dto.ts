import { UpdateListSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class UpdateListDto extends createZodDto(UpdateListSchema) {}
