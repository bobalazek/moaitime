import { IncomingMessage } from 'http';

import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WebSocket, WebSocketServer as WsWebSocketServer } from 'ws';

import { authManager, usersManager } from '@moaitime/database-services';
import { globalEventNotifier } from '@moaitime/global-event-notifier';
import { logger } from '@moaitime/logging';
import { GlobalEvents, GlobalEventsEnum } from '@moaitime/shared-common';

// TODO: is there a more optimal way to do this?
export let globalNotifierSubscription: () => void;

@WebSocketGateway({ path: '/ws', cors: true })
export class WebsocketGateway
  implements
    OnGatewayInit<WebSocket>,
    OnGatewayConnection<WebSocket>,
    OnGatewayDisconnect<WebSocket>
{
  @WebSocketServer()
  private _server!: WsWebSocketServer;

  private _userSocketsMap: Map<string, WebSocket> = new Map();
  private _teamUserIdsMap: Map<string, string[]> = new Map();

  afterInit() {
    logger.info(`[WebsocketGateway] Subscribing to events ...`);

    globalNotifierSubscription = globalEventNotifier.subscribe('*', async (message) => {
      const { type, payload } = message as {
        type: GlobalEventsEnum;
        payload: GlobalEvents[GlobalEventsEnum];
      };

      if (!('teamId' in payload) || !payload.teamId) {
        return;
      }

      const sockets = this._getSocketsForTeam(payload.teamId);
      for (const socket of sockets) {
        const userId = this._getUserId(socket);
        if ('userId' in payload && userId === payload.userId) {
          continue;
        }

        socket.send(JSON.stringify({ type, payload }));
      }
    });
  }

  async handleConnection(client: WebSocket, incomingMessage: IncomingMessage) {
    const accessToken = incomingMessage.url?.replace('/ws?userAccessToken=', '');

    const userWithAccessToken = accessToken
      ? await authManager.getUserByAccessToken(accessToken)
      : null;
    if (!userWithAccessToken) {
      logger.debug(
        `[WebsocketGateway] A client tried to connect with an invalid access token (${accessToken}). Closing the connection ...`
      );

      client.close();

      return;
    }

    logger.debug(
      `[WebsocketGateway] New client (${userWithAccessToken.user.email}) connected. There are now ${this._server.clients.size} clients connected.`
    );

    this._setMapValues(client, userWithAccessToken.user.id);
  }

  async handleDisconnect(client: WebSocket) {
    logger.debug(
      `[WebsocketGateway] A client disconnected. There are now ${this._server.clients.size} clients connected.`
    );

    this._removeMapValues(client);
  }

  // Private
  private _getSocketsForTeam(teamId: string) {
    const userIds = this._teamUserIdsMap.get(teamId) || [];
    const sockets: WebSocket[] = [];

    for (const userId of userIds) {
      const socket = this._userSocketsMap.get(userId);
      if (socket) {
        sockets.push(socket);
      }
    }

    return sockets;
  }

  private async _setMapValues(client: WebSocket, userId: string) {
    this._userSocketsMap.set(userId, client);

    const userTeams = await usersManager.getTeamIds(userId);
    for (const teamId of userTeams) {
      const teamUserIds = this._teamUserIdsMap.get(teamId) || [];
      teamUserIds.push(userId);

      this._teamUserIdsMap.set(teamId, teamUserIds);
    }
  }

  private _getUserId(client: WebSocket) {
    for (const [key, value] of this._userSocketsMap) {
      if (value === client) {
        return key;
      }
    }

    return null;
  }

  private async _removeMapValues(client: WebSocket) {
    const userId = this._getUserId(client);
    if (!userId) {
      return;
    }

    this._userSocketsMap.delete(userId);

    const userTeams = await usersManager.getTeamIds(userId);
    for (const teamId of userTeams) {
      const teamUserIds = this._teamUserIdsMap.get(teamId) || [];
      const index = teamUserIds.indexOf(userId);
      if (index !== -1) {
        teamUserIds.splice(index, 1);
      }

      this._teamUserIdsMap.set(teamId, teamUserIds);
    }
  }
}
