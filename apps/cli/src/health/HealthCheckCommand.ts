import type { Command } from 'commander';

import { healthChecker } from '@moaitime/health-checker';
import { logger } from '@moaitime/logging';
import { shutdownManager } from '@moaitime/processes';

export const addHealthCheckCommand = (program: Command) => {
  const command = program.command('health:check').action(async () => {
    try {
      logger.info('Starting the health check ...');

      await healthChecker.check();

      await shutdownManager.shutdown(0);
    } catch (error) {
      logger.error(error, '[addHealthCheckCommand] Error');

      await shutdownManager.shutdown(1);
    }
  });
  program.addCommand(command);
};
