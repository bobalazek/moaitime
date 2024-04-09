import si from 'systeminformation';

import { executeRawQuery } from '@moaitime/database-core';
import { Logger, logger } from '@moaitime/logging';
import { rabbitMQ } from '@moaitime/rabbitmq';
import { redis } from '@moaitime/redis';
import { getEnv } from '@moaitime/shared-backend';

export class HealthChecker {
  constructor(private _logger: Logger) {}

  async check() {
    this._logger.info(`[HealthChecker] ========== Starting the health check ... ==========`);

    // We technically also check the environment variables here, but that it kind of checked earlier,
    // when all the classes get loaded, so if there is a problem with the environment variables,
    // the app won't even start.

    const { NODE_ENV, SERVICE_NAME, LOGGER_LEVEL } = getEnv();

    this._logger.debug(`[HealthChecker] NODE_ENV: "${NODE_ENV}"`);
    this._logger.debug(`[HealthChecker] SERVICE_NAME: "${SERVICE_NAME}"`);
    this._logger.debug(`[HealthChecker] LOGGER_LEVEL: "${LOGGER_LEVEL}"`);

    await this._checkSystemHealth();
    await this._checkDatabase();
    await this._checkRedis();
    await this._checkRabbitMQ();

    // TODO: add prometheus pushgateway check

    this._logger.info(`[HealthChecker] ========== All health checks ran successfully ==========`);
  }

  private async _checkSystemHealth() {
    this._logger.info(`[HealthChecker] ---------- System Health ----------`);

    // Memory
    const memUsage = await si.mem();
    this._logger.debug(
      `[HealthChecker] Total Memory: ${(memUsage.total / 1024 / 1024 / 1024).toFixed(2)}GB`
    );
    this._logger.debug(
      `[HealthChecker] Used Memory: ${(memUsage.used / 1024 / 1024 / 1024).toFixed(2)}GB`
    );
    this._logger.debug(
      `[HealthChecker] Free Memory: ${(memUsage.free / 1024 / 1024 / 1024).toFixed(2)}GB`
    );

    // CPU
    const cpuLoad = await si.currentLoad();
    this._logger.debug(`[HealthChecker] CPU Load (average): ${cpuLoad.avgLoad.toFixed(2)}%`);
    this._logger.debug(
      `[HealthChecker] CPU Load per Core: ${cpuLoad.cpus.map((cpu) => `${cpu.load.toFixed(2)}%`).join(', ')}`
    );
    this._logger.debug(`[HealthChecker] CPU Current Load: ${cpuLoad.currentLoad.toFixed(2)}`);
    this._logger.debug(
      `[HealthChecker] CPU Current Load User: ${cpuLoad.currentLoadUser.toFixed(2)}%`
    );
    this._logger.debug(
      `[HealthChecker] CPU Current Load System: ${cpuLoad.currentLoadSystem.toFixed(2)}%`
    );

    // System Uptime
    const uptime = si.time();
    this._logger.debug(`[HealthChecker] System Uptime: ${uptime.uptime / 60} minutes`);
  }

  private async _checkDatabase() {
    this._logger.info(`[HealthChecker] ---------- Database ----------`);

    this._logger.debug(`[HealthChecker] Database check ...`);

    await executeRawQuery('SELECT 1');
  }

  private async _checkRedis() {
    this._logger.info(`[HealthChecker] ---------- Redis ----------`);

    const redisClient = redis.getClient();

    this._logger.debug(`[HealthChecker] Redis ping ...`);

    await redisClient.ping();
  }

  private async _checkRabbitMQ() {
    this._logger.info(`[HealthChecker] ---------- RabbitMQ ----------`);

    this._logger.debug(`[HealthChecker] RabbitMQ channel check ...`);

    await rabbitMQ.connect({
      timeout: 5000,
    });

    await rabbitMQ.getConnection();
  }
}

export const healthChecker = new HealthChecker(logger);
