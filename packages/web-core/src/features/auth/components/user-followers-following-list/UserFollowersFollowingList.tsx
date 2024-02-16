import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';

import { Button } from '@moaitime/web-ui';

import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';
import { useUserFollowersQuery } from '../../hooks/useUserFollowersQuery';
import { useUserFollowingQuery } from '../../hooks/useUserFollowingQuery';
import UserFollowEntry from '../user-follow-entry/UserFollowEntry';

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

export default function UserFollowersFollowingList({
  type,
  userIdOrUsername,
}: {
  type: 'followers' | 'following';
  userIdOrUsername: string;
}) {
  const query = type === 'followers' ? useUserFollowersQuery : useUserFollowingQuery;
  const { data, isLoading, hasNextPage, fetchNextPage, hasPreviousPage, fetchPreviousPage, error } =
    query(userIdOrUsername);

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
    <div data-test="users--view--user-following-list">
      {items.length === 0 && (
        <div className="text-muted-foreground justify-center text-center">
          <div className="mb-3 text-xl">This user does not follow anyone yet.</div>
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
                    <UserFollowEntry user={user} />
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
