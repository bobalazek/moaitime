import { GlobalEvents, GlobalEventsEnum } from '@moaitime/shared-common';

import { useAuthStore } from '../../auth/state/authStore';
import { useTeamsStore } from '../../auth/state/teamsStore';
import { useCalendarStore } from '../../calendar/state/calendarStore';
import { useListsStore } from '../../tasks/state/listsStore';
import { getConfig } from './ConfigHelpers';

export class WebsocketManager {
  private _socket: WebSocket | null = null;
  private _isInitialized = false;

  async init() {
    if (this._isInitialized) {
      return;
    }

    const { auth } = useAuthStore.getState();
    if (auth) {
      const config = await getConfig();
      if (config?.websocketUrl) {
        this.connect(config.websocketUrl);
      }
    }

    useAuthStore.subscribe(async (state, prevState) => {
      if (state.auth?.user.id !== prevState.auth?.user.id) {
        this.disconnect();

        if (state.auth?.user.id) {
          const config = await getConfig();
          if (config?.websocketUrl) {
            this.connect(config.websocketUrl);
          }
        }
      }
    });

    useTeamsStore.subscribe(async (state, prevState) => {
      if (state.joinedTeam?.team.id !== prevState.joinedTeam?.team.id) {
        this.disconnect();

        if (state.joinedTeam?.team.id) {
          const config = await getConfig();
          if (config?.websocketUrl) {
            this.connect(config.websocketUrl);
          }
        }
      }
    });

    this._isInitialized = true;
  }

  connect(websocketUrl: string) {
    if (this._socket) {
      this._socket.close();
      this._socket = null;
    }

    this._socket = new WebSocket(websocketUrl);

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

    // Debug
    window.addEventListener('vite:beforeUpdate', () => {
      this.disconnect();
    });
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
