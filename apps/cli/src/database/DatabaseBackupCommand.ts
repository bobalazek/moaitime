import type { Command } from 'commander';

import { doDatabaseBackup } from '@moaitime/database-core';
import { logger } from '@moaitime/logging';
import { shutdownManager } from '@moaitime/processes';

export const addDatabaseBackupCommand = (program: Command) => {
  const command = program
    .command('database:backup')
    .argument('[fileName]', 'What custom file name should be used for the backup?')
    .action(async (fileName?: string) => {
      try {
        await doDatabaseBackup(fileName);

        await shutdownManager.shutdown(0);
      } catch (error) {
        logger.error(error, `[addDatabaseBackupCommand] Error:`);

        await shutdownManager.shutdown(1);
      }
    });
  program.addCommand(command);
};
