import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

import { logger } from '@moaitime/logging';

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

    const responseData = {
      statusCode,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
    const loggerData = {
      ...responseData,
      stack: exception.stack,
    };

    response.status(statusCode).json(responseData);

    logger.error(loggerData, '[HttpExceptionFilter] An error occurred.');
  }
}
