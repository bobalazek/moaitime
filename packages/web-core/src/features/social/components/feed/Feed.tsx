import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';
import { useFeedQuery } from '../../hooks/useFeedQuery';

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
    <div data-test="feed" className="flex flex-col gap-2">
      {items.map((post) => (
        <div key={post.id} className="rounded-lg border-2 p-4 shadow-md">
          {post.content}
        </div>
      ))}
    </div>
  );
};

export default Feed;
