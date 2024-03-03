import { formatDistance } from 'date-fns';
import { Link } from 'react-router-dom';

import { FeedPost as FeedPostType } from '@moaitime/shared-common';

import { UserAvatar } from '../../../core/components/UserAvatar';

export default function FeedPost({ feedPost }: { feedPost: FeedPostType }) {
  const now = new Date();

  return (
    <div key={feedPost.id} className="flex flex-row gap-4 rounded-lg border-2 p-4 shadow-md">
      <Link to={`/social/users/${feedPost.user.username}`}>
        <UserAvatar user={feedPost.user} />
      </Link>
      <div className="flex w-full flex-col gap-2">
        <div>
          <Link to={`/social/users/${feedPost.user.username}`} className="text-xl font-bold">
            @{feedPost.user.username}
          </Link>
          <time
            className="text-muted-foreground block text-xs"
            title={new Date(feedPost.createdAt).toLocaleString()}
          >
            {formatDistance(new Date(feedPost.createdAt), now, {
              addSuffix: true,
            })}
          </time>
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html: feedPost.content,
          }}
        />
      </div>
    </div>
  );
}
