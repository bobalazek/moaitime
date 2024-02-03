import { Module, OnModuleDestroy } from '@nestjs/common';

import { globalNotifierSubscription, WebsocketGateway } from './gateways/websocket.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [WebsocketGateway],
})
export class WebsocketModule implements OnModuleDestroy {
  async onModuleDestroy() {
    if (globalNotifierSubscription) {
      await globalNotifierSubscription();
    }
  }
}
