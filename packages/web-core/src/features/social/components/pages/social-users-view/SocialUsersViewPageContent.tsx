import { formatRelative } from 'date-fns';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

import { PublicUser } from '@moaitime/shared-common';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@moaitime/web-ui';

import { UserAvatar } from '../../../../core/components/UserAvatar';
import { useStateAndUrlSync } from '../../../../core/hooks/useStateAndUrlSync';
import UserAchievementsGrid from '../../user-achievements-grid/UserAchievementsGrid';
import UserBlockButton from '../../user-buttons/UserBlockButton';
import UserFollowButton from '../../user-buttons/UserFollowButton';
import UserReportButton from '../../user-buttons/UserReportButton';
import UserFollowersFollowingList, {
  UserFollowersFollowingListRef,
} from '../../user-followers-following-list/UserFollowersFollowingList';

type Views = '' | 'following' | 'follow-requests'; /* 'followers' is the default view */

const getViewFromUrl = (url: string, userUsername: string): Views => {
  const view = url.replace(`/social/users/${userUsername}`, '').replace('/', '');
  if (view === 'following' || view === 'follow-requests') {
    return view as Views;
  }

  return '';
};

const SocialUsersViewPageContent = ({
  user,
  refetch,
}: {
  user: PublicUser;
  refetch: () => void;
}) => {
  const location = useLocation();
  const [targetUri, setTargetUri] = useState(location.pathname);
  const [view, setView] = useState<Views>(getViewFromUrl(location.pathname, user.username));
  const userFollowersListRef = useRef<UserFollowersFollowingListRef>(null);

  const updateStateByUrl = useDebouncedCallback(() => {
    const newView = getViewFromUrl(location.pathname, user.username);
    if (newView !== view) {
      setView(newView as Views);
    }
  }, 10);

  useEffect(() => {
    const newTargetUri = `/social/users/${user.username}${view ? `/${view}` : ''}`;

    setTargetUri(newTargetUri);
  }, [setTargetUri, user.username, view]);

  useStateAndUrlSync(updateStateByUrl, targetUri);

  const now = new Date();
  const joinedString = new Date(user.createdAt).toLocaleDateString('default', {
    month: 'long',
    year: 'numeric',
  });
  const canViewFollowersAndFollowing =
    user.isMyself || !user.isPrivate || (user.isPrivate && user.myselfIsFollowingThisUser === true);

  const onAfterFollowButtonClick = () => {
    refetch();
    userFollowersListRef.current?.refetch();
  };

  const onAfterBlockButtonClick = () => {
    refetch();
  };

  return (
    <div className="container py-4" data-test="social--users-view--content">
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="col-span-12 lg:col-span-6 xl:col-span-8">
          <div className="flex flex-row flex-wrap gap-4 overflow-auto">
            <div>
              {/*
                Needs to be in an empty div, otherwise the UserAvatar's height is expanded
                100% of the space and the lastActive dot is positioned incorrectly
              */}
              <UserAvatar user={user} sizePx={96} />
            </div>
            <div className="flex flex-col gap-2 truncate">
              <div>
                <h2 className="flex flex-wrap items-center gap-4">
                  <span className="truncate text-2xl font-bold md:text-3xl lg:text-5xl">
                    {user.displayName}
                  </span>
                  <UserFollowButton user={user} onAfterClick={onAfterFollowButtonClick} />
                  <UserBlockButton user={user} onAfterClick={onAfterBlockButtonClick} />
                  <UserReportButton user={user} />
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
                {typeof user.experiencePoints === 'number' && (
                  <>
                    <span> • </span>
                    <span>
                      <b>{user.experiencePoints}</b> XP
                    </span>
                  </>
                )}
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
          <div className="col-span-12 lg:col-span-6 xl:col-span-4">
            <Tabs
              className="bg-background flex-wrap rounded border"
              value={view}
              onValueChange={(value) => {
                setView(value as Views);
              }}
            >
              <TabsList className="flex w-full flex-wrap">
                <TabsTrigger className="flex-grow" value="">
                  Followers
                </TabsTrigger>
                <TabsTrigger className="flex-grow" value="following">
                  Following
                </TabsTrigger>
                {user.isMyself && (
                  <TabsTrigger className="flex-grow" value="follow-requests">
                    Follow Requests
                  </TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="" className="p-4">
                <UserFollowersFollowingList
                  type="followers"
                  userIdOrUsername={user.username}
                  ref={userFollowersListRef}
                />
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
      <div className="mt-8">
        <h3 className="text-2xl font-bold">Achievements</h3>
        <UserAchievementsGrid user={user} />
      </div>
    </div>
  );
};

export default SocialUsersViewPageContent;
