import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';
import { useUserSearchQuery } from '../../hooks/useUserSearchQuery';
import UserFollowEntry from '../user-follow-entry/UserFollowEntry';

export default function UserSearch({ query }: { query?: string }) {
  const { isLoading, error, data, refetch, hasNextPage, fetchNextPage } = useUserSearchQuery(query);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  const items = data?.pages.flatMap((page) => page.data!) ?? [];

  if (items.length === 0) {
    return (
      <div className="text-muted-foreground text-center text-xl">
        No users found with string <b>"{query}"</b>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl [&>*]:mt-[-1px] [&>*]:border [&>*]:p-4">
      {items.map((user) => (
        <UserFollowEntry
          key={user.id}
          user={user}
          onAfterClick={() => {
            refetch();
          }}
        />
      ))}
      {hasNextPage && (
        <div className="flex justify-center">
          <button onClick={() => fetchNextPage()}>Load more</button>
        </div>
      )}
    </div>
  );
}
