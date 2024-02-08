import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';

import { getEnv } from '@moaitime/shared-backend';

import { AppModule } from './app.module';
import { ErrorFilter } from './filters/error.filter';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ZodValidationPipe } from './utils/validation-helpers';

export async function bootstrap() {
  // Variables
  const { API_PORT, NODE_ENV } = getEnv();
  const port = API_PORT || 3636;
  const isProduction = NODE_ENV === 'production';

  // App
  const app = await NestFactory.create(AppModule, {
    cors: true,
    // This relates to the Websocket module,
    // where it wouldn't want to close the connections while we were developing
    forceCloseConnections: !isProduction,
  });

  // Shutdown
  app.enableShutdownHooks();

  process.on('SIGINT', async () => await app.close());
  process.on('SIGTERM', async () => await app.close());

  // WebSocket
  app.useWebSocketAdapter(new WsAdapter(app));

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
  await app.listen(port);

  const url = await app.getUrl();

  Logger.log(`🚀 Application is running on: ${url}`);

  return app;
}

bootstrap();
