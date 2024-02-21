import { spawn, SpawnOptionsWithoutStdio } from 'child_process';
import { resolve } from 'path';
import type { Command } from 'commander';

import { logger } from '@moaitime/logging';
import { shutdownManager } from '@moaitime/processes';

function runCommand(fullCommand: string, options?: SpawnOptionsWithoutStdio) {
  const command = fullCommand.split(' ')[0];
  const args = fullCommand.split(' ').slice(1);

  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, args, { shell: true, ...options });
    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);
    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve(void 0);
      } else {
        reject(new Error(`Command "${command} ${args.join(' ')}" exited with code ${code}`));
      }
    });
  });
}

export const addDatabaseGenerateMigrationCommand = (program: Command) => {
  const command = program.command('database:generate-migration').action(async () => {
    try {
      const cwd = resolve(`${process.cwd()}/../../packages/database-core`);

      await runCommand(
        `cd ${cwd} && npx drizzle-kit generate:pg --config=./src/drizzle.config.ts && cd ../.. && npm run format`,
        {
          cwd,
          shell: true,
          env: {
            ...process.env,
            FORCE_COLOR: 'true',
          },
        }
      );

      await shutdownManager.shutdown(0);
    } catch (error) {
      logger.error(error, '[addDatabaseGenerateMigrationCommand] Error');

      await shutdownManager.shutdown(1);
    }
  });
  program.addCommand(command);
};
