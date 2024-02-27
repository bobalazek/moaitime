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
import { globalEventsNotifier } from '@moaitime/global-events-notifier';
import { logger } from '@moaitime/logging';
import { WebsocketCloseCodeEnum } from '@moaitime/shared-common';

// TODO: is there a more optimal way to do this?
export let globalNotifierSubscription: () => Promise<void>;
export let terminateServer: () => Promise<void>;

@WebSocketGateway({ path: '/ws', cors: true })
export class WebsocketGateway
  implements
    OnGatewayInit<WebSocket>,
    OnGatewayConnection<WebSocket>,
    OnGatewayDisconnect<WebSocket>
{
  @WebSocketServer()
  private _server!: WsWebSocketServer;

  private _websocketToUserIdMap: Map<WebSocket, string> = new Map(); // websocketToken => userId
  private _websocketTokenToWebsocketMap: Map<string, WebSocket> = new Map(); // websocketToken => websocket
  private _userIdToWebsocketTokensMap: Map<string, string[]> = new Map(); // userId => websocketToken[]
  private _teamToUserIdsMap: Map<string, string[]> = new Map(); // teamId => userId[]

  afterInit() {
    (async () => {
      logger.info(`[WebsocketGateway] Subscribing to events ...`);

      globalNotifierSubscription = await globalEventsNotifier.subscribeToPubSub(
        '*',
        async (message) => {
          const { type, payload } = message;

          const teamId = 'teamId' in payload ? payload.teamId : undefined;
          const userIds = 'userIds' in payload ? payload.userIds : undefined;
          const actorUserId = 'actorUserId' in payload ? payload.actorUserId : undefined;
          const actorWebsocketToken =
            'actorWebsocketToken' in payload ? payload.actorWebsocketToken : undefined;

          const allUserIds = Array.from(
            new Set<string>([...(userIds ?? []), ...(actorUserId ? [actorUserId] : [])])
          );

          const userWebsockets = this._getWebsockets(teamId, allUserIds);

          // We do not want to push the websocket token of the actor that triggered it for security reasons
          const finalPayload = {
            ...payload,
            actorWebsocketToken: undefined,
          };

          for (const websocket of userWebsockets) {
            const websocketToken = this._getWebsocketToken(websocket);
            if (actorWebsocketToken && actorWebsocketToken === websocketToken) {
              continue;
            }

            websocket.send(JSON.stringify({ type, payload: finalPayload }));
          }
        }
      );
    })();

    terminateServer = async () => {
      logger.debug(`[WebsocketGateway] Terminating the server ...`);

      for (const websocket of this._server.clients) {
        websocket.close(WebsocketCloseCodeEnum.SERVER_TERMINATED, 'Server terminated.');
      }

      this._server.close(() => {
        logger.debug(`[WebsocketGateway] Server closed.`);
      });
    };
  }

  async handleConnection(client: WebSocket, incomingMessage: IncomingMessage) {
    const url = new URL(`${incomingMessage.headers.origin ?? 'localhost'}${incomingMessage.url}`);

    const websocketToken = url.searchParams.get('websocketToken') ?? null;
    if (!websocketToken) {
      logger.debug(
        `[WebsocketGateway] A client tried to connect without a websocket token. Closing the connection ...`
      );

      client.close(WebsocketCloseCodeEnum.INVALID_WEBSOCKET_TOKEN, 'Invalid websocket token.');

      return;
    }

    const accessToken = url.searchParams.get('userAccessToken') ?? null;
    const userWithAccessToken = accessToken
      ? await authManager.getUserByAccessToken(accessToken)
      : null;
    if (!userWithAccessToken) {
      logger.debug(
        `[WebsocketGateway] A client tried to connect with an invalid access token (${accessToken}). Closing the connection ...`
      );

      client.close(WebsocketCloseCodeEnum.INVALID_ACCESS_TOKEN, 'Invalid access token.');

      return;
    }

    logger.debug(
      `[WebsocketGateway] New client (${userWithAccessToken.user.email}) connected. There are now ${this._server.clients.size} clients connected.`
    );

    this._setMapValues(client, websocketToken, userWithAccessToken.user.id);

    client.send(
      JSON.stringify({
        type: 'connected',
        payload: { userId: userWithAccessToken.user.id },
      })
    );
  }

  async handleDisconnect(client: WebSocket) {
    logger.debug(
      `[WebsocketGateway] A client disconnected. There are now ${this._server.clients.size} clients connected.`
    );

    this._removeMapValues(client);
  }

  // Private
  private _getWebsockets(teamId?: string, userIds?: string[]) {
    const websocketsSet = new Set<WebSocket>();

    if (teamId) {
      const teamUserIds = this._teamToUserIdsMap.get(teamId) || [];
      for (const teamUserId of teamUserIds) {
        const userWebsocketTokens = this._userIdToWebsocketTokensMap.get(teamUserId) ?? [];
        for (const websocketToken of userWebsocketTokens) {
          const websocket = this._websocketTokenToWebsocketMap.get(websocketToken);
          if (!websocket) {
            continue;
          }

          websocketsSet.add(websocket);
        }
      }
    }

    if (userIds && userIds.length > 0) {
      for (const userId of userIds) {
        const userWebsocketTokens = this._userIdToWebsocketTokensMap.get(userId) || [];
        for (const websocketToken of userWebsocketTokens) {
          const websocket = this._websocketTokenToWebsocketMap.get(websocketToken);
          if (!websocket) {
            continue;
          }

          websocketsSet.add(websocket);
        }
      }
    }

    return Array.from(websocketsSet);
  }

  private async _setMapValues(client: WebSocket, websocketToken: string, userId: string) {
    this._websocketToUserIdMap.set(client, userId);
    this._websocketTokenToWebsocketMap.set(websocketToken, client);

    const userWebsocketTokens = this._userIdToWebsocketTokensMap.get(userId) || [];
    userWebsocketTokens.push(websocketToken);
    this._userIdToWebsocketTokensMap.set(userId, userWebsocketTokens);

    const userTeams = await usersManager.getTeamIds(userId);
    for (const teamId of userTeams) {
      const teamUserIds = this._teamToUserIdsMap.get(teamId) || [];
      teamUserIds.push(userId);

      this._teamToUserIdsMap.set(teamId, teamUserIds);
    }
  }

  private async _removeMapValues(client: WebSocket) {
    this._websocketToUserIdMap.delete(client);

    // We need to do this first, before we actually delete the incomming message
    const websocketToken = this._getWebsocketToken(client);
    if (websocketToken) {
      this._websocketTokenToWebsocketMap.delete(websocketToken);
    }

    const userId = this._getUserId(client);
    if (userId) {
      this._userIdToWebsocketTokensMap.delete(userId);

      const userTeams = await usersManager.getTeamIds(userId);
      for (const teamId of userTeams) {
        const teamUserIds = this._teamToUserIdsMap.get(teamId) || [];
        const index = teamUserIds.indexOf(userId);
        if (index !== -1) {
          teamUserIds.splice(index, 1);
        }

        this._teamToUserIdsMap.set(teamId, teamUserIds);
      }
    }
  }

  private _getWebsocketToken(client: WebSocket) {
    // TODO: will need to get significalntly more performant!
    for (const [key, value] of this._websocketTokenToWebsocketMap) {
      if (value === client) {
        return key;
      }
    }

    return null;
  }

  private _getUserId(client: WebSocket) {
    return this._websocketToUserIdMap.get(client) ?? null;
  }
}
