import UserNotificationsActivity from '../../user-notifications-activity/UserNotificationsActivity';

const NotificationsPageContent = () => {
  return (
    <div className="container py-4" data-test="notifications--content">
      <UserNotificationsActivity />
    </div>
  );
};

export default NotificationsPageContent;
