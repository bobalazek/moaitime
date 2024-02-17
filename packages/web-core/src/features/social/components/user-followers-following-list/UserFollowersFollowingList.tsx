import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';

import { Button } from '@moaitime/web-ui';

import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';
import { useUserFollowersQuery } from '../../hooks/useUserFollowersQuery';
import { useUserFollowingQuery } from '../../hooks/useUserFollowingQuery';
import { useUserFollowRequestsQuery } from '../../hooks/useUserFollowRequestsQuery';
import UserFollowEntry from '../user-follow-entry/UserFollowEntry';

const animationVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
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

export default function UserFollowersFollowingList({
  type,
  userIdOrUsername,
}: {
  type: 'followers' | 'following' | 'follow-requests';
  userIdOrUsername: string;
}) {
  const query =
    type === 'followers'
      ? useUserFollowersQuery
      : type === 'following'
        ? useUserFollowingQuery
        : useUserFollowRequestsQuery;
  const {
    data,
    refetch,
    isLoading,
    hasNextPage,
    fetchNextPage,
    hasPreviousPage,
    fetchPreviousPage,
    error,
  } = query(userIdOrUsername);

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
    <div className="w-full" data-test={`users--view--user-${type}-list`}>
      {items.length === 0 && (
        <div className="text-muted-foreground justify-center text-center">
          {type === 'followers'
            ? 'No followers yet.'
            : type === 'following'
              ? 'Not following anyone yet.'
              : 'No follow requests yet.'}
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
              {items.map((user) => {
                return (
                  <motion.div
                    key={user.id}
                    layout
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={animationVariants}
                  >
                    <UserFollowEntry
                      user={user}
                      onAfterClick={() => refetch()}
                      showRemoveFollowerButton={type === 'followers'}
                      type={type}
                    />
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
    </div>
  );
}
