import { z } from 'zod';

import { getRuleFromString } from '../../RepeatHelpers';

export const RepeatPatternSchema = z.string().refine(
  (data) => {
    if (!data) {
      return true;
    }

    try {
      getRuleFromString(data);

      return true;
    } catch (e) {
      return false;
    }
  },
  {
    message: 'Invalid repeat pattern',
  }
);
