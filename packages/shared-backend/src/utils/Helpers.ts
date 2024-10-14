import { existsSync } from 'fs';
import { join, resolve } from 'path';

import dotenv from 'dotenv';

import { ROOT_DIR } from '../Constants';

export const loadEnvironmentVariables = () => {
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const files = [
    `.env.generated`,
    `.env.${NODE_ENV}.local`,
    `.env.local`,
    `.env.${NODE_ENV}`,
    `.env`,
  ];

  const path: string[] = [];
  files.forEach((file) => {
    const envFilePath = resolve(join(ROOT_DIR, file));
    if (!existsSync(envFilePath)) {
      return;
    }

    path.push(envFilePath);
  });

  if (path.length === 0) {
    console.warn('No environment variables file found');

    return {};
  }

  console.log(`Loading environment variables from "${path.join(', ')}" ...`);

  const result = dotenv.config({ path });

  return result.parsed;
};
