import { UserNotification as UserNotificationType } from '@moaitime/shared-common';

export const UserNotification = ({
  userNotification,
}: {
  userNotification: UserNotificationType;
}) => {
  return (
    <div
      className="bg-muted flex flex-row items-center rounded-xl p-4"
      data-user-notification-id={userNotification.id}
      data-test="notifications--user-notification"
    >
      <div
        className="flex flex-grow items-center justify-between"
        dangerouslySetInnerHTML={{
          __html: userNotification.content,
        }}
      />
    </div>
  );
};
