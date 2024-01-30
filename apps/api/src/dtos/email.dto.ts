import { z } from 'zod';

import { createZodDto } from '../utils/validation-helpers';

export const EmailDtoSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .min(1, { message: 'Email is required' })
    .max(255, { message: 'Email must be less than 255 characters' }),
});

export class EmailDto extends createZodDto(EmailDtoSchema) {}
