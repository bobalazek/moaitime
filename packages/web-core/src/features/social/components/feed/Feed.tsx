import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';
import { useFeedQuery } from '../../hooks/useFeedQuery';
import FeedEntry from './FeedEntry';

const Feed = ({ userIdOrUsername }: { userIdOrUsername?: string }) => {
  const { isLoading, error, data } = useFeedQuery(userIdOrUsername);

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
    <div data-test="feed" className="flex flex-col gap-4">
      {items.map((feedEntry) => (
        <FeedEntry key={feedEntry.id} feedEntry={feedEntry} />
      ))}
    </div>
  );
};

export default Feed;
