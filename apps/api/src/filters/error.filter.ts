import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { logger } from '@moaitime/logging';
import { zodErrorToString } from '@moaitime/shared-common';

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exceptionAny = exception as any;
    const exceptionResponse = exceptionAny.getResponse?.();

    const statusCode = exceptionResponse?.statusCode ?? HttpStatus.BAD_REQUEST;

    let error = 'Something went wrong.';
    if (Array.isArray(exceptionAny.errors)) {
      // Hacky way to check if ZodError as instanceof not working with esbuild.
      // Issue: https://github.com/evanw/esbuild/issues/3333
      error = zodErrorToString(exceptionAny);
    } else if (exceptionResponse?.message) {
      error = Array.isArray(exceptionResponse.message)
        ? exceptionResponse.message.join('; ')
        : exceptionResponse.message;
    } else if (exception.message) {
      error = Array.isArray(exception.message) ? exception.message.join('; ') : exception.message;
    }

    const responseData = {
      statusCode,
      error,
      timestamp: new Date().toISOString(),
    };
    const loggerData = {
      ...responseData,
      stack: exception.stack,
    };

    response.status(statusCode).json(responseData);

    logger.error(loggerData, '[ErrorFilter] An error occurred.');
  }
}
