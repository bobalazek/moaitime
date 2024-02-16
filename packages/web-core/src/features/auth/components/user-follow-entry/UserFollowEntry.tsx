import { PublicUser } from '@moaitime/shared-common';

import { UserAvatar } from '../../../core/components/UserAvatar';

export default function UserFollowEntry({ user }: { user: PublicUser }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <UserAvatar user={user} sizePx={48} />
        <div>
          <div className="font-bold">{user.username}</div>
          <div className="text-muted-foreground text-sm">{user.displayName}</div>
        </div>
      </div>
      <div>TODO</div>
    </div>
  );
}
