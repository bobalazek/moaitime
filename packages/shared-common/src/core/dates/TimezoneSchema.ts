import { z } from 'zod';

import { getTimezones } from '../../Helpers';

export const TimezoneSchema = z
  .string({
    required_error: 'Timezone is required',
  })
  .refine(
    (data) => {
      if (!data) {
        return true;
      }

      return getTimezones().includes(data);
    },
    {
      message: 'Invalid timezone',
    }
  );
