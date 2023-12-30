import type { Command } from 'commander';

import { jobRunner } from '@moaitime/job-runner';
import { logger } from '@moaitime/logging';
import { shutdownManager } from '@moaitime/processes';

export const addJobsRunnerStartCommand = (program: Command) => {
  const command = program.command('jobs:runner:start').action(async () => {
    try {
      logger.info('Starting job runner ...');

      await jobRunner.start();

      await shutdownManager.shutdown(0);
    } catch (error) {
      logger.error(error, '[addJobsRunnerStartCommand] Error');

      await shutdownManager.shutdown(1);
    }
  });
  program.addCommand(command);
};
