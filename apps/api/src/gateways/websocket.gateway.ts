import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WebSocket, WebSocketServer as WsWebSocketServer } from 'ws';

import { logger } from '@moaitime/logging';

@WebSocketGateway({ path: '/ws', cors: true })
export class WebsocketGateway
  implements
    OnGatewayInit<WebSocket>,
    OnGatewayConnection<WebSocket>,
    OnGatewayDisconnect<WebSocket>
{
  @WebSocketServer()
  server!: WsWebSocketServer;

  afterInit() {
    logger.info(`[WebsocketGateway] Subscribing to events ...`);

    // TODO: subscribe to events
  }

  handleConnection() {
    logger.debug(
      `[WebsocketGateway] New client connected. There are now ${this.server.clients.size} clients connected.`
    );
  }

  handleDisconnect() {
    logger.debug(
      `[WebsocketGateway] A client disconnected. There are now ${this.server.clients.size} clients connected.`
    );
  }

  broadcastToAllOpenClients(channel: string, data: unknown) {
    if (this.server.clients.size === 0) {
      return;
    }

    logger.debug(
      `[WebsocketGateway] Broadcasting ${channel} to ${this.server.clients.size} clients ...`
    );

    this.server.clients.forEach(function each(client) {
      if (client.readyState !== WebSocket.OPEN) {
        return;
      }

      client.send(JSON.stringify({ channel, data }), {
        binary: false,
      });
    });
  }
}
