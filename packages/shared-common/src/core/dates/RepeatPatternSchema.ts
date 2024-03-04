import { z } from 'zod';

import { recurrenceParser } from '@moaitime/recurrence-parser';

export const RepeatPatternSchema = z.string().refine(
  (data) => {
    if (!data) {
      return true;
    }

    try {
      recurrenceParser.getRuleFromString(data);

      return true;
    } catch (e) {
      return false;
    }
  },
  {
    message: 'Invalid repeat pattern',
  }
);
