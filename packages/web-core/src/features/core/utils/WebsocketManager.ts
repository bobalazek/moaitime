import { GlobalEvents, GlobalEventsEnum, WS_URL } from '@moaitime/shared-common';

import { useListsStore } from '../../tasks/state/listsStore';

export class WebsocketManager {
  private _socket: WebSocket | null = null;

  connect(userAccessToken: string) {
    if (this._socket) {
      this._socket.close();
      this._socket = null;
    }

    const url = new URL(WS_URL);
    url.searchParams.append('userAccessToken', userAccessToken);

    this._socket = new WebSocket(url.toString());

    this._socket.onopen = () => {
      // We are now connected
    };

    this._socket.onmessage = async (event) => {
      const data = JSON.parse(event.data) as {
        type: GlobalEventsEnum;
        payload: GlobalEvents[GlobalEventsEnum];
      };

      if (data.type.startsWith('tasks:')) {
        const { reloadSelectedListTasks, reloadTasksCountMap } = useListsStore.getState();

        await reloadSelectedListTasks();
        await reloadTasksCountMap();
      }
    };

    this._socket.onclose = () => {
      // TODO: possibly reconnect?
    };

    this._socket.onerror = () => {
      // TODO: handle error and possibly reconnect
    };
  }
}

export const websocketManager = new WebsocketManager();
