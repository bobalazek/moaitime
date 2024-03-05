import { createElement } from 'react';

import { GlobalEvents, GlobalEventsEnum } from '@moaitime/shared-common';

import { sonnerToast } from '../../../../../web-ui/src/components/sonner-toast';
import { useAuthStore } from '../../auth/state/authStore';
import { useCalendarStore } from '../../calendar/state/calendarStore';
import { useUserNotificationsStore } from '../../notifications/state/userNotificationsStore';
import { useListsStore } from '../../tasks/state/listsStore';
import { useTasksStore } from '../../tasks/state/tasksStore';
import { playNudgeTaskSound } from '../../tasks/utils/TaskHelpers';
import { useTeamsStore } from '../../teams/state/teamsStore';
import { globalEventsEmitter } from '../state/globalEventsEmitter';
import { setWebsocketToken } from './FetchHelpers';
import { getWebsocketUrl } from './WebsocketHelpers';

export class WebsocketManager {
  private _socket: WebSocket | null = null;
  private _isInitialized = false;
  private _shouldReconnect = true;
  private _reconnectionAttempts = 0;
  private _maxReconnectionAttempts = 5;
  private _reconnectionDelay = 1000;
  private _maxReconnectionDelay = 16000;

  async joinAndConnect() {
    if (this._isInitialized) {
      return;
    }

    this._subscribeToAuthAndTeamsStore();

    this._isInitialized = true;
  }

  connect(websocketUrl: string) {
    this._reconnectionAttempts = 0;

    if (this._socket) {
      this._shouldReconnect = false;
      this._socket.close();
      this._socket = null;
    }

    this._shouldReconnect = true;
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
      if (this._shouldReconnect && this._reconnectionAttempts < this._maxReconnectionAttempts) {
        const delay = Math.min(
          this._reconnectionDelay * Math.pow(2, this._reconnectionAttempts),
          this._maxReconnectionDelay
        );
        setTimeout(() => {
          this._reconnectionAttempts++;
          this.connect(websocketUrl);
        }, delay);
      }

      if (event.code > 4000 && event.code < 5000) {
        sonnerToast.error('Websocket Error', {
          description: event.reason ?? 'Unknown websocket error. Please refresh the page.',
        });
      }

      this.disconnect();

      // TODO: Possibly try to reconnect?
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
    this._shouldReconnect = false;

    if (!this._socket) {
      return;
    }

    this._socket.close();
    this._socket = null;
  }

  // Private
  async _subscribeToAuthAndTeamsStore() {
    // Auth
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

    // Teams
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
  }

  async _onMessage(event: MessageEvent) {
    const data = JSON.parse(event.data) as {
      type: GlobalEventsEnum;
      payload: GlobalEvents[GlobalEventsEnum];
    };

    if (data.type === GlobalEventsEnum.TASKS_TASK_NUDGED) {
      await this._onTasksTaskNudged(
        data.payload as GlobalEvents[GlobalEventsEnum.TASKS_TASK_NUDGED]
      );
    } else if (data.type === GlobalEventsEnum.NOTIFICATIONS_USER_NOTIFICATION_ADDED) {
      await this._onNotificationsUserNotificationAdded(
        data.payload as GlobalEvents[GlobalEventsEnum.NOTIFICATIONS_USER_NOTIFICATION_ADDED]
      );
    } else if (data.type.startsWith('achievements:achievement:')) {
      // Just so we can trigger a re-fetch of the achievements on the grid component
      // or wherever it's used
      globalEventsEmitter.emit(data.type, data.payload);
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
      const { reloadJoinedTeamMembers, reloadJoinedTeamUserInvitations } = useTeamsStore.getState();

      await reloadJoinedTeamMembers();
      await reloadJoinedTeamUserInvitations();
    }
  }

  // Private
  // Tasks
  async _onTasksTaskNudged(payload: GlobalEvents[GlobalEventsEnum.TASKS_TASK_NUDGED]) {
    const { joinedTeamMembers } = useTeamsStore.getState();
    const { getTask, openPopoverForTask } = useTasksStore.getState();

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
  }

  // Notifications
  async _onNotificationsUserNotificationAdded(
    payload: GlobalEvents[GlobalEventsEnum.NOTIFICATIONS_USER_NOTIFICATION_ADDED]
  ) {
    const { getUserNotification, markUserNotificationAsRead, reloadUnreadUserNotificationsCount } =
      useUserNotificationsStore.getState();

    await reloadUnreadUserNotificationsCount();

    const userNotification = await getUserNotification(payload.userNotificationId);
    if (!userNotification) {
      return;
    }

    const description = createElement('div', {
      dangerouslySetInnerHTML: {
        __html: userNotification.content,
      },
    });

    sonnerToast.info('New Notification', {
      description,
      duration: 15000,
      position: 'top-right',
      action: {
        label: 'View',
        onClick: async () => {
          await markUserNotificationAsRead(userNotification.id);

          if (!userNotification.link) {
            globalEventsEmitter.emit(GlobalEventsEnum.NAVIGATE_TO, {
              location: '/notifications',
            });

            return;
          }

          globalEventsEmitter.emit(GlobalEventsEnum.NAVIGATE_TO, {
            location: userNotification.link,
          });
        },
      },
    });
  }
}

export const websocketManager = new WebsocketManager();
