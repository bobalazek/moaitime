import { Module, OnModuleDestroy } from '@nestjs/common';

import { getEnv } from '@moaitime/shared-backend';

import { globalNotifierSubscription, WebsocketGateway } from './gateways/websocket.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [WebsocketGateway],
})
export class WebsocketModule implements OnModuleDestroy {
  async onModuleDestroy() {
    const { NODE_ENV } = getEnv();

    // The reason we only do that on production is because in development the HML will reload faster that we can close the connection,
    // so we would often get issues that the server port is already used.
    if (NODE_ENV === 'production' && globalNotifierSubscription) {
      await globalNotifierSubscription();
    }
  }
}
