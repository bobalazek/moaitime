import { GlobalEvents, GlobalEventsEnum } from '@moaitime/shared-common';

import { sonnerToast } from '../../../../../web-ui/src/components/sonner-toast';
import { useAuthStore } from '../../auth/state/authStore';
import { useCalendarStore } from '../../calendar/state/calendarStore';
import { useListsStore } from '../../tasks/state/listsStore';
import { useTasksStore } from '../../tasks/state/tasksStore';
import { playNudgeTaskSound } from '../../tasks/utils/TaskHelpers';
import { useTeamsStore } from '../../teams/state/teamsStore';
import { setWebsocketToken } from './FetchHelpers';
import { getWebsocketUrl } from './WebsocketHelpers';

export class WebsocketManager {
  private _socket: WebSocket | null = null;
  private _isInitialized = false;

  async init() {
    if (this._isInitialized) {
      return;
    }

    const { auth } = useAuthStore.getState();
    if (auth) {
      const websocketUrl = await getWebsocketUrl();
      if (websocketUrl) {
        this.connect(websocketUrl);
      }
    }

    useAuthStore.subscribe(async (state, prevState) => {
      if (state.auth?.user.id !== prevState.auth?.user.id) {
        this.disconnect();

        if (state.auth?.user.id) {
          const websocketUrl = await getWebsocketUrl();
          if (websocketUrl) {
            this.connect(websocketUrl);
          }
        }
      }
    });

    useTeamsStore.subscribe(async (state, prevState) => {
      if (state.joinedTeam?.team.id !== prevState.joinedTeam?.team.id) {
        this.disconnect();

        if (state.joinedTeam?.team.id) {
          const websocketUrl = await getWebsocketUrl();
          if (websocketUrl) {
            this.connect(websocketUrl);
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

    const url = new URL(websocketUrl);

    const websocketToken = url.searchParams.get('websocketToken');
    if (websocketToken) {
      setWebsocketToken(websocketToken);
    }

    this._socket.onopen = () => {
      // Connection opened
    };

    this._socket.onmessage = async (event) => {
      await this._onMessage(event);
    };

    this._socket.onclose = (event) => {
      if (event.code > 4000 && event.code < 5000) {
        sonnerToast.error('Websocket Error', {
          description: event.reason ?? 'Invalid access token. Please refresh the page.',
        });
      }

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

    if (data.type === GlobalEventsEnum.TASKS_TASK_NUDGED) {
      const { joinedTeamMembers } = useTeamsStore.getState();
      const { getTask, openPopoverForTask } = useTasksStore.getState();
      const payload = data.payload as GlobalEvents[GlobalEventsEnum.TASKS_TASK_NUDGED];

      const task = await getTask(payload.taskId);
      if (!task) {
        return;
      }

      let nudgerName = 'Unknown';
      for (const teamMember of joinedTeamMembers) {
        if (teamMember.user?.id === payload.actorUserId) {
          nudgerName = teamMember.user!.displayName;
          break;
        }
      }

      playNudgeTaskSound();

      sonnerToast.info('Task Nudged', {
        description: `The task "${task.name}" was nudged by ${nudgerName}.`,
        duration: 15000,
        position: 'top-right',
        action: {
          label: 'View Task',
          onClick: () => {
            openPopoverForTask(task);
          },
        },
      });
    } else if (data.type.startsWith('tasks:list:')) {
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
    } else if (data.type.startsWith('teams:team-member:')) {
      const { reloadJoinedTeamMembers } = useTeamsStore.getState();

      await reloadJoinedTeamMembers();
    }
  }
}

export const websocketManager = new WebsocketManager();
