import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';

import { GlobalEventsEnum } from '@moaitime/shared-common';
import { Button } from '@moaitime/web-ui';

import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';
import { globalEventsEmitter } from '../../../core/state/globalEventsEmitter';
import { useUserNotificationsQuery } from '../../hooks/useUserNotificationsQuery';
import { UserNotification } from '../user-notification/UserNotification';

const animationVariants = {
  initial: { opacity: 0, y: -100 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 100 },
};

function FetchNextPageButton({ fetchNextPage }: { fetchNextPage: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const entry = useIntersectionObserver(ref, {});
  const isVisible = !!entry?.isIntersecting;

  useEffect(() => {
    if (isVisible) {
      fetchNextPage();
    }
  }, [isVisible, fetchNextPage]);

  return (
    <Button ref={ref} className="btn btn-primary" onClick={() => fetchNextPage()}>
      Load More
    </Button>
  );
}

function UserNotificationsActivityInner() {
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    hasPreviousPage,
    fetchPreviousPage,
    refetch,
    error,
  } = useUserNotificationsQuery();

  useEffect(() => {
    const callback = () => {
      refetch();
    };

    globalEventsEmitter.on(GlobalEventsEnum.NOTIFICATIONS_USER_NOTIFICATION_DELETED, callback);
    globalEventsEmitter.on(
      GlobalEventsEnum.NOTIFICATIONS_USER_NOTIFICATION_MARKED_AS_READ,
      callback
    );
    globalEventsEmitter.on(
      GlobalEventsEnum.NOTIFICATIONS_USER_NOTIFICATION_MARKED_AS_UNREAD,
      callback
    );

    return () => {
      globalEventsEmitter.off(GlobalEventsEnum.NOTIFICATIONS_USER_NOTIFICATION_DELETED, callback);
      globalEventsEmitter.off(
        GlobalEventsEnum.NOTIFICATIONS_USER_NOTIFICATION_MARKED_AS_READ,
        callback
      );
      globalEventsEmitter.off(
        GlobalEventsEnum.NOTIFICATIONS_USER_NOTIFICATION_MARKED_AS_UNREAD,
        callback
      );
    };
  }, [refetch]);

  const items = data?.pages.flatMap((page) => page.data!);
  if (!items) {
    return null;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  return (
    <>
      {items.length === 0 && (
        <div className="text-muted-foreground justify-center text-center">
          <div className="mb-3 text-3xl leading-10">
            No notifications right now. <br /> Lucky you! <br /> 😊
          </div>
        </div>
      )}
      {items.length > 0 && (
        <div className="space-y-4">
          {hasPreviousPage && (
            <div className="flex justify-center">
              <Button className="btn btn-primary" onClick={() => fetchPreviousPage()}>
                Load newer
              </Button>
            </div>
          )}
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {items.map((userNotification) => {
                return (
                  <motion.div
                    key={userNotification.id}
                    layout
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={animationVariants}
                  >
                    <UserNotification userNotification={userNotification} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          {hasNextPage && (
            <div className="flex justify-center">
              <FetchNextPageButton fetchNextPage={fetchNextPage} />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default function UserNotificationsActivity() {
  return (
    <div data-test="notifications--user-notifications-activity">
      <UserNotificationsActivityInner />
    </div>
  );
}
