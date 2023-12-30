import type { Command } from 'commander';

import { jobRunner } from '@moaitime/job-runner';
import { logger } from '@moaitime/logging';

export const addJobsRunnerStartCommand = (program: Command) => {
  const command = program.command('jobs:runner:start').action(async () => {
    logger.info('Starting job runner ...');

    await jobRunner.start();
  });
  program.addCommand(command);
};
