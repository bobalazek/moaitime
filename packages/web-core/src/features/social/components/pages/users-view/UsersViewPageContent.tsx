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
  const canViewFollowersAndFollowing =
    user.isMyself || !user.isPrivate || (user.isPrivate && user.myselfIsFollowingThisUser === true);

  return (
    <div className="container py-4" data-test="social--users-view--content">
      <div className="grid gap-2 md:grid-cols-12">
        <div className="md:col-span-6 lg:col-span-8">
          <div className="flex gap-6">
            <div>
              {/*
                Needs to be in an empty div, otherwise the UserAvatar's height is expanded
                100% of the space and the lastActive dot is positioned incorrectly
              */}
              <UserAvatar user={user} sizePx={96} />
            </div>
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
              {user.biography && <div className="text-lg">{user.biography}</div>}
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
        {canViewFollowersAndFollowing && (
          <div className="md:col-span-6 lg:col-span-4">
            <Tabs className="rounded border" defaultValue="followers">
              <TabsList className="w-full">
                <TabsTrigger className="w-full" value="followers">
                  Followers
                </TabsTrigger>
                <TabsTrigger className="w-full" value="following">
                  Following
                </TabsTrigger>
                {user.isMyself && (
                  <TabsTrigger className="w-full" value="follow-requests">
                    Follow Requests
                  </TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="followers" className="p-4">
                <UserFollowersFollowingList type="followers" userIdOrUsername={user.username} />
              </TabsContent>
              <TabsContent value="following" className="p-4">
                <UserFollowersFollowingList type="following" userIdOrUsername={user.username} />
              </TabsContent>
              <TabsContent value="follow-requests" className="p-4">
                <UserFollowersFollowingList
                  type="follow-requests"
                  userIdOrUsername={user.username}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersViewPageContent;
