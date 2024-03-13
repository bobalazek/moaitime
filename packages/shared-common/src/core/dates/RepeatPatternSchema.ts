import { z } from 'zod';

import { Recurrence } from '@moaitime/recurrence';

export const RepeatPatternSchema = z.string().refine(
  (data) => {
    if (!data) {
      return true;
    }

    try {
      Recurrence.fromStringPattern(data);

      return true;
    } catch (e) {
      return false;
    }
  },
  {
    message: 'Invalid repeat pattern',
  }
);
