import { existsSync } from 'fs';
import { join, resolve } from 'path';

import dotenv from 'dotenv';

import { ROOT_DIR } from '../Constants';

export const loadEnvironmentVariables = () => {
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const files = [`.env.${NODE_ENV}.local`, `.env.local`, `.env.${NODE_ENV}`, `.env`];
  files.forEach((file) => {
    const envFilePath = resolve(join(ROOT_DIR, file));
    if (!existsSync(envFilePath)) {
      return;
    }

    console.log(`Loading environment variables from ${envFilePath} ...`);

    dotenv.config({ path: envFilePath });
  });

  return {
    NODE_ENV,
  };
};
