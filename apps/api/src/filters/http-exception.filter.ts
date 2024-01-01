import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

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
    if (exception.stack) {
      stack = exception.stack.split('\n');
    }

    response.status(statusCode).json({
      statusCode,
      error,
      stack,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
