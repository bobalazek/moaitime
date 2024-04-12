import type { Command } from 'commander';

import { doDatabaseRecovery } from '@moaitime/database-core';
import { logger } from '@moaitime/logging';
import { shutdownManager } from '@moaitime/processes';

export const addDatabaseRecoverCommand = (program: Command) => {
  const command = program
    .command('database:recover <fileName>')
    .option('-c, --confirm', 'Confirm the recovery of the database')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .action(async (fileName: string, options: any) => {
      try {
        const confirm = !!options.confirm;

        await doDatabaseRecovery(fileName, confirm);

        await shutdownManager.shutdown(0);
      } catch (error) {
        logger.error(error, `[DatabaseRecoverCommand] Error:`);

        await shutdownManager.shutdown(1);
      }
    });
  program.addCommand(command);
};
