import { clsx } from 'clsx';
import { formatDistance } from 'date-fns';
import { useNavigate } from 'react-router-dom';

import { EntityTypeEnum, UserNotification as UserNotificationType } from '@moaitime/shared-common';

import { useTasksStore } from '../../../tasks/state/tasksStore';
import { useUserNotificationsStore } from '../../state/userNotificationsStore';
import { UserNotificationActions } from './UserNotificationActions';

export const UserNotification = ({
  userNotification,
}: {
  userNotification: UserNotificationType;
}) => {
  const navigate = useNavigate();
  const { markUserNotificationAsRead } = useUserNotificationsStore();

  const now = new Date();
  const createdAt = new Date(userNotification.createdAt);

  const onClick = async () => {
    if (!userNotification.readAt) {
      await markUserNotificationAsRead(userNotification.id);
    }

    if (!userNotification.targetEntity) {
      return;
    }

    const entityType = userNotification.targetEntity.type ?? null;
    const entityId = userNotification.targetEntity.id ?? null;

    if (entityType === EntityTypeEnum.TASKS && entityId) {
      const { openPopoverForTask } = useTasksStore.getState();

      openPopoverForTask(entityId);
    } else if (userNotification.link) {
      navigate(userNotification.link);
    }
  };

  return (
    <div
      className="bg-muted hover:bg-muted/60 flex cursor-pointer justify-between rounded-xl px-6 py-4 transition-all"
      onClick={onClick}
      data-user-notification-id={userNotification.id}
      data-test="notifications--user-notification"
    >
      <div>
        <div
          dangerouslySetInnerHTML={{
            __html: userNotification.content,
          }}
        />
        <div
          className={clsx(
            'text-foreground-muted text-xs',
            !userNotification.readAt && 'text-blue-500 dark:text-blue-400'
          )}
        >
          {formatDistance(createdAt, now, { addSuffix: true })}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <UserNotificationActions userNotification={userNotification} />
        <div className="w-3">
          {!userNotification.readAt && (
            <div
              className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400"
              data-test="notifications--user-notification--unread-dot"
            />
          )}
        </div>
      </div>
    </div>
  );
};
