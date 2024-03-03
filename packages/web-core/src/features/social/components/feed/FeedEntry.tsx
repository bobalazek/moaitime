import { formatDistance } from 'date-fns';
import { Link } from 'react-router-dom';

import { FeedEntry as FeedEntryType } from '@moaitime/shared-common';

import { UserAvatar } from '../../../core/components/UserAvatar';

export default function FeedEntry({ feedEntry }: { feedEntry: FeedEntryType }) {
  const now = new Date();

  return (
    <div key={feedEntry.id} className="flex flex-row gap-4 rounded-lg border-2 p-4 shadow-md">
      <Link to={`/social/users/${feedEntry.user.username}`}>
        <UserAvatar user={feedEntry.user} />
      </Link>
      <div className="flex w-full flex-col gap-2">
        <div>
          <Link to={`/social/users/${feedEntry.user.username}`} className="text-xl font-bold">
            @{feedEntry.user.username}
          </Link>
          <time
            className="text-muted-foreground block text-xs"
            title={new Date(feedEntry.createdAt).toLocaleString()}
          >
            {formatDistance(new Date(feedEntry.createdAt), now, {
              addSuffix: true,
            })}
          </time>
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html: feedEntry.content,
          }}
        />
      </div>
    </div>
  );
}
