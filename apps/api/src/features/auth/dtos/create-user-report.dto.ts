import { CreateReportSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class CreateUserReportDto extends createZodDto(CreateReportSchema) {}
