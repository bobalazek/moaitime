import { MiddlewareConsumer, Module, NestModule, OnModuleDestroy } from '@nestjs/common';

import { AuthMiddleware } from '../features/auth/middlewares/auth.middleware';
import { WebsocketController } from './controllers/websocket.controller';
import {
  globalNotifierSubscription,
  terminateServer,
  WebsocketGateway,
} from './gateways/websocket.gateway';

@Module({
  imports: [],
  controllers: [WebsocketController],
  providers: [WebsocketGateway],
})
export class WebsocketModule implements NestModule, OnModuleDestroy {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }

  async onModuleDestroy() {
    // https://github.com/nestjs/nest/issues/10131
    // The reason we only do that on production is because in development the HML will reload faster that we can close the connection,
    // so we would often get issues that the server port is already used.
    if (globalNotifierSubscription && terminateServer) {
      await globalNotifierSubscription();
      await terminateServer();
    }
  }
}
