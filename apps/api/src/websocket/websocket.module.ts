import { Module, OnModuleDestroy } from '@nestjs/common';

import {
  globalNotifierSubscription,
  terminateServer,
  WebsocketGateway,
} from './gateways/websocket.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [WebsocketGateway],
})
export class WebsocketModule implements OnModuleDestroy {
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
