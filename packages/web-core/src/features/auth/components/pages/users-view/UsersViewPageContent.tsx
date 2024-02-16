import { formatRelative } from 'date-fns';
import { CalendarIcon, ClockIcon } from 'lucide-react';

import { PublicUser } from '@moaitime/shared-common';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@moaitime/web-ui';

import { UserAvatar } from '../../../../core/components/UserAvatar';
import UserBlockButton from '../../user-buttons/UserBlockButton';
import UserFollowButton from '../../user-buttons/UserFollowButton';
import UserFollowersFollowingList from '../../user-followers-following-list/UserFollowersFollowingList';

const UsersViewPageContent = ({ user, refetch }: { user: PublicUser; refetch: () => void }) => {
  const now = new Date();
  const joinedString = new Date(user.createdAt).toLocaleDateString('default', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="container py-4" data-test="users-view--content">
      <div className="grid grid-cols-10 gap-2">
        <div className="col-span-7">
          <div className="flex items-center gap-6">
            <UserAvatar user={user} sizePx={80} />
            <div className="flex flex-col gap-2">
              <div>
                <h2 className="flex items-center gap-4">
                  <span className="text-5xl font-bold">{user.displayName}</span>
                  <UserFollowButton user={user} onAfterClick={refetch} />
                  <UserBlockButton user={user} onAfterClick={refetch} />
                </h2>
                <h3 className="text-muted-foreground text-2xl">{user.username}</h3>
              </div>
              <div className="flex gap-2 text-lg">
                <span>
                  <b>{user.followersCount}</b> followers
                </span>
                <span> • </span>
                <span>
                  <b>{user.followingCount}</b> following
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CalendarIcon size={16} />
                  <span>Joined {joinedString}</span>
                </div>
                {user.lastActiveAt && (
                  <div className="flex items-center gap-2">
                    <ClockIcon size={16} />
                    <span>Last active {formatRelative(new Date(user.lastActiveAt), now)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <Tabs className="rounded border" defaultValue="followers">
            <TabsList className="w-full">
              <TabsTrigger className="w-full" value="followers">
                Followers
              </TabsTrigger>
              <TabsTrigger className="w-full" value="following">
                Following
              </TabsTrigger>
            </TabsList>
            <TabsContent value="followers" className="p-4">
              <UserFollowersFollowingList type="followers" userIdOrUsername={user.username} />
            </TabsContent>
            <TabsContent value="following" className="p-4">
              <UserFollowersFollowingList type="following" userIdOrUsername={user.username} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UsersViewPageContent;
