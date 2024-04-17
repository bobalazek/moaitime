import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

import { logger } from '@moaitime/logging';
import { getEnv } from '@moaitime/shared-backend';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exceptionResponse = exception.getResponse() as any;

    let error = exceptionResponse.error;
    if (Array.isArray(exceptionResponse.message)) {
      error = exceptionResponse.message.join('; ');
    } else if (exceptionResponse.message) {
      error = exceptionResponse.message;
    }

    let stack: string[] | undefined;
    if (getEnv().NODE_ENV !== 'production' && exception.stack) {
      stack = exception.stack.split('\n');
    }

    const data = {
      statusCode,
      error,
      stack,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(statusCode).json(data);

    logger.error(data, '[HttpExceptionFilter] An error occurred.');
  }
}
