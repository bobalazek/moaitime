import { SubscriptionSchema } from '@moaitime/shared-common';

import { createZodDto } from '../../../utils/validation-helpers';

export class SubscriptionDto extends createZodDto(SubscriptionSchema) {}
