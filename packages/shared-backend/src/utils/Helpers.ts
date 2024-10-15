import { existsSync } from 'fs';
import { join, resolve } from 'path';

import dotenv from 'dotenv';

import { ROOT_DIR } from '../Constants';

export const loadEnvironmentVariables = () => {
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const files = [
    `.env`,
    `.env.${NODE_ENV}`,
    `.env.local`,
    `.env.${NODE_ENV}.local`,
    `.env.generated`,
  ];
  files.forEach((file) => {
    const envFilePath = resolve(join(ROOT_DIR, file));
    if (!existsSync(envFilePath)) {
      return;
    }

    dotenv.config({ path: envFilePath, override: true });
  });
};
