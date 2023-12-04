import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exceptionResponse = (exception as any).getResponse?.();

    const statusCode = exceptionResponse?.statusCode ?? HttpStatus.BAD_REQUEST;

    let error = Array.isArray(exception.message) ? exception.message.join('; ') : exception.message;
    if (exceptionResponse?.message) {
      error = Array.isArray(exceptionResponse.message)
        ? exceptionResponse.message.join('; ')
        : exceptionResponse.message;
    }

    let stack: string[] | undefined;
    if (exception.stack) {
      stack = exception.stack.split('\n');
    }

    response.status(statusCode).json({
      statusCode,
      error,
      stack,
      timestamp: new Date().toISOString(),
    });
  }
}
