import { z } from 'zod';

import { MAIN_COLORS } from './MainColors';

export const ColorSchema = z.string().refine(
  (data) => {
    if (!data) {
      return true;
    }

    const colors = MAIN_COLORS.map((color) => color.value);

    return colors.includes(data);
  },
  {
    message: 'Invalid color',
  }
);
