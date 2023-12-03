import { hostname } from 'os';
import { join } from 'path';

import pino, { BaseLogger, Bindings, LogFn, transport, TransportTargetOptions } from 'pino';

import { getEnv, LOGS_DIR } from '@myzenbuddy/shared-backend';

const { LOGGER_FORCE_JSON_OUTPUT, LOGGER_WRITE_TO_LOG_FILES, NODE_ENV, LOGGER_LEVEL, SERVICE_NAME } = getEnv();

export class Logger implements BaseLogger {
  private _logger: ReturnType<typeof pino>;
  private _loggerTransport: ReturnType<typeof transport>;
  private _isEnabled = true;

  public level = 'trace';

  constructor() {
    this.level = LOGGER_LEVEL;

    this._loggerTransport = this._createTransport();
    this._logger = pino(this._defaultOptions(), this._loggerTransport);

    this.fatal = this._logMethod('fatal');
    this.error = this._logMethod('error');
    this.warn = this._logMethod('warn');
    this.info = this._logMethod('info');
    this.debug = this._logMethod('debug');
    this.trace = this._logMethod('trace');
  }

  reset(bindings: Bindings) {
    const defaultOptions = this._defaultOptions();
    const base = bindings['base'] ? { ...defaultOptions.base, ...bindings['base'] } : defaultOptions;
    const options = { ...defaultOptions, ...bindings, base };

    this._cleanup();

    this._loggerTransport = this._createTransport();
    this._logger = pino(options, this._loggerTransport);

    this.fatal = this._logMethod('fatal');
    this.error = this._logMethod('error');
    this.warn = this._logMethod('warn');
    this.info = this._logMethod('info');
    this.debug = this._logMethod('debug');
    this.trace = this._logMethod('trace');
  }

  getPino() {
    return this._logger;
  }

  fatal: LogFn;
  error: LogFn;
  warn: LogFn;
  info: LogFn;
  debug: LogFn;
  trace: LogFn;

  // Implement the silent method to satisfy the BaseLogger interface
  silent() {
    this._logger.level = 'silent';
  }

  setEnabled(enabled: boolean) {
    this._isEnabled = enabled;
  }

  async terminate() {
    this._cleanup();
  }

  private _defaultOptions() {
    return {
      level: this.level,
      base: {
        pid: process.pid,
        hostname: hostname(),
        env: NODE_ENV,
        service: SERVICE_NAME,
      },
    };
  }

  private _cleanup() {
    this._logger.flush();
    this._loggerTransport.flushSync?.();
    this._loggerTransport.end?.();
  }

  private _createTransport() {
    if (LOGGER_FORCE_JSON_OUTPUT) {
      return process.stdout;
    }

    const targets: TransportTargetOptions[] = [];

    if (LOGGER_WRITE_TO_LOG_FILES) {
      const logPath = join(LOGS_DIR, 'app.log');
      targets.push({
        target: 'pino/file',
        level: this.level,
        options: {
          destination: logPath,
          mkdir: true,
        },
      });
    }

    if (NODE_ENV !== 'production') {
      targets.push({
        target: 'pino-pretty',
        level: this.level,
        options: {
          minimumLevel: this.level,
          colorize: true,
        },
      });
    } else {
      targets.push({
        target: 'pino-syslog',
        level: this.level,
        options: {
          enablePipelining: false,
          destination: 1,
          newline: true,
        },
      });
    }

    return transport({
      targets,
      worker: {
        autoEnd: false,
      },
    });
  }

  private _logMethod(level: keyof BaseLogger) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (...args: any[]) => {
      if (!this._isEnabled) {
        return;
      }

      if (typeof this._logger[level] === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this._logger[level] as any)(...args);
      }
    };
  }
}

export const logger = new Logger();
