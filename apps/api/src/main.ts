import { getEnv } from '@moaitime/shared-backend';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './features/core/app.module';
import { ErrorFilter } from './features/core/filters/error.filter';
import { HttpExceptionFilter } from './features/core/filters/http-exception.filter';
import { ZodValidationPipe } from './features/core/utils/validation-helpers';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  // Variables
  const { API_PORT, NODE_ENV } = getEnv();
  const port = API_PORT || 3636;

  app.enableCors();

  // Shutdown
  app.enableShutdownHooks();

  process.on('SIGINT', async () => app.close());
  process.on('SIGTERM', async () => app.close());

  // Exceptions (order matters - first it will catch and set the response for error, but if it's an HttpException, then that will override it)
  app.useGlobalFilters(new ErrorFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Validation
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalPipes(
    // Need to keep that for now, as it is transforming the body to the DTO
    new ValidationPipe({
      transform: true,
    })
  );

  // Start server
  if (NODE_ENV === 'test') {
    await app.listen(port);
  } else {
    await app.listen(port, '127.0.0.1');
  }

  const url = await app.getUrl();

  Logger.log(`🚀 Application is running on: ${url}`);

  return app;
}

bootstrap();
