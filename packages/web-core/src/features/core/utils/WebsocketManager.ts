import { GlobalEvents, GlobalEventsEnum, WS_URL } from '@moaitime/shared-common';

import { useCalendarStore } from '../../calendar/state/calendarStore';
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
      await this._onMessage(event);
    };

    this._socket.onclose = () => {
      this.disconnect();
    };

    this._socket.onerror = () => {
      this.disconnect();
    };
  }

  disconnect() {
    if (!this._socket) {
      return;
    }

    this._socket.close();
    this._socket = null;

    // TODO: Possibly try to reconnect?
  }

  // Private
  async _onMessage(event: MessageEvent) {
    const data = JSON.parse(event.data) as {
      type: GlobalEventsEnum;
      payload: GlobalEvents[GlobalEventsEnum];
    };

    if (data.type.startsWith('tasks:list:')) {
      const { reloadLists, reloadSelectedListTasks } = useListsStore.getState();

      await reloadLists();
      await reloadSelectedListTasks();
    } else if (data.type.startsWith('tasks:')) {
      const { reloadSelectedListTasks, reloadTasksCountMap } = useListsStore.getState();

      await reloadSelectedListTasks();
      await reloadTasksCountMap();
    } else if (data.type.startsWith('calendar:event:')) {
      const { reloadCalendarEntriesDebounced } = useCalendarStore.getState();

      await reloadCalendarEntriesDebounced();
    }
  }
}

export const websocketManager = new WebsocketManager();
