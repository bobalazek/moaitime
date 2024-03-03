import { useEffect, useRef } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';

import { Button } from '@moaitime/web-ui';

import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';
import { useFeedQuery } from '../../hooks/useFeedQuery';
import FeedPost from './FeedPost';

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

const Feed = ({ userIdOrUsername }: { userIdOrUsername?: string }) => {
  const { isLoading, error, data, hasPreviousPage, hasNextPage, fetchPreviousPage, fetchNextPage } =
    useFeedQuery(userIdOrUsername);

  if (isLoading) {
    return <Loader />;
  }

  if (error || !data) {
    return <ErrorAlert error={error} />;
  }

  const items = data?.pages.flatMap((page) => page.data!);
  if (!items || items.length === 0) {
    return <div className="text-muted-foreground">No posts found yet.</div>;
  }

  return (
    <div>
      {hasPreviousPage && (
        <div className="flex justify-center">
          <Button className="btn btn-primary" onClick={() => fetchPreviousPage()}>
            Load newer
          </Button>
        </div>
      )}
      <div data-test="feed" className="flex flex-col gap-4">
        {items.map((feedPost) => (
          <FeedPost key={feedPost.id} feedPost={feedPost} />
        ))}
      </div>
      {hasNextPage && (
        <div className="flex justify-center">
          <FetchNextPageButton fetchNextPage={fetchNextPage} />
        </div>
      )}
    </div>
  );
};

export default Feed;
