import { z } from 'zod';

export const HexSchema = z.string().refine(
  (data) => {
    if (!data) {
      return true;
    }

    return /^#([0-9A-F]{3}){1,2}$/i.test(data);
  },
  {
    message: 'Invalid hex code',
  }
);
