import type { Command } from 'commander';

import { updatePublicCalendarsSeedData } from '@moaitime/database-seeds';
import { logger } from '@moaitime/logging';
import { shutdownManager } from '@moaitime/processes';

export const addDatabaseSeedsPublicCalendarsUpdateCommand = (program: Command) => {
  const command = program.command('database:seeds:public-calendars:update').action(async () => {
    try {
      await updatePublicCalendarsSeedData();

      await shutdownManager.shutdown(0);
    } catch (error) {
      logger.error(error, '[addDatabaseSeedsPublicCalendarsUpdateCommand] Error');

      await shutdownManager.shutdown(1);
    }
  });
  program.addCommand(command);
};
