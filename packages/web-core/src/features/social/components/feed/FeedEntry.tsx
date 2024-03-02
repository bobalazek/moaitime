import { Link } from 'react-router-dom';

import { FeedEntry as FeedEntryType } from '@moaitime/shared-common';

import { UserAvatar } from '../../../core/components/UserAvatar';

export default function FeedEntry({ feedEntry }: { feedEntry: FeedEntryType }) {
  return (
    <div key={feedEntry.id} className="flex flex-row gap-4 rounded-lg border-2 p-4 shadow-md">
      <Link to={`/social/users/${feedEntry.user.username}`}>
        <UserAvatar user={feedEntry.user} />
      </Link>
      <div className="w-full">
        <div className="flex items-center justify-between">
          <Link to={`/social/users/${feedEntry.user.username}`} className="text-xl font-bold">
            @{feedEntry.user.username}
          </Link>
          <span className="text-muted-foreground text-xs">
            {new Date(feedEntry.createdAt).toLocaleString()}
          </span>
        </div>
        {feedEntry.content}
      </div>
    </div>
  );
}
