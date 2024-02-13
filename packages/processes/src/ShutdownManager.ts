import { Logger, logger } from '@moaitime/logging';

type ShutdownTask = { name: string; task: () => Promise<void>; priority?: number };

export class ShutdownManager {
  private _hasShutdownStarted = false;
  private _tasks: ShutdownTask[] = [];

  constructor(private _logger: Logger) {}

  registerTask(name: string, task: ShutdownTask['task'], priority?: number) {
    this._logger.debug(`[ShutdownManager] Registering shutdown task "${name}" ...`);

    this._tasks.push({ name, task, priority });
  }

  unregisterTask(name: string) {
    this._logger.debug(`[ShutdownManager] Unregistering shutdown task "${name}" ...`);

    this._tasks = this._tasks.filter((t) => t.name !== name);
  }

  registerExitHandlers() {
    process.on('unhandledRejection', async (reason, promise) => {
      this._logger.error({ promise, reason }, `[ShutdownManager] Unhandled Rejection at:`);

      return this.shutdown(1);
    });

    process.on('uncaughtException', async (error) => {
      this._logger.error(error, '[ShutdownManager] Uncaught exception: ');

      return this.shutdown(1);
    });

    process.on('SIGINT', async () => {
      this._logger.warn('[ShutdownManager] SIGINT received. Shutting down ...');

      return this.shutdown(0);
    });

    process.on('SIGTERM', async () => {
      this._logger.warn('[ShutdownManager] SIGTERM received. Shutting down ...');

      return this.shutdown(0);
    });
  }

  hasShutdownStarted() {
    return this._hasShutdownStarted;
  }

  async shutdown(exitCode: number): Promise<void> {
    if (this._hasShutdownStarted) {
      this._logger.debug(`[ShutdownManager] Shutdown already started. Ignoring ...`);

      return;
    }

    this._logger.debug(`[ShutdownManager] Shutting down ...`);

    this._hasShutdownStarted = true;

    const sortedTasks = this._tasks.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
    for (const task of sortedTasks) {
      this._logger.debug(`[ShutdownManager] Executing shutdown task: "${task.name}" ...`);

      try {
        await task.task();
      } catch (error) {
        this._logger.error(error, `[ShutdownManager] Error executing shutdown task:`);
      }
    }

    this._logger.debug(`[ShutdownManager] Shutdown complete. Terminating logger ...`);

    await this._logger.terminate();

    process.exit(exitCode);
  }
}

export const shutdownManager = new ShutdownManager(logger);
