import { useEffect } from 'react';

import { GlobalEventsEnum, PublicUser } from '@moaitime/shared-common';

import { useAuthStore } from '../../../auth/state/authStore';
import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';
import { globalEventsEmitter } from '../../../core/state/globalEventsEmitter';
import { useUserAchievementsQuery } from '../../hooks/useUserAchievementsQuery';

export type UserAchievementsGridProps = {
  user: PublicUser;
};

export default function UserAchievementsGrid({ user }: UserAchievementsGridProps) {
  const { auth } = useAuthStore();
  const { isLoading, error, data, refetch } = useUserAchievementsQuery(user.id);

  useEffect(() => {
    if (isLoading || !auth || auth.user.id !== user.id) {
      return;
    }

    const callback = () => {
      refetch();
    };

    globalEventsEmitter.on(GlobalEventsEnum.ACHIEVEMENTS_ACHIEVEMENT_ADDED, callback);
    globalEventsEmitter.on(GlobalEventsEnum.ACHIEVEMENTS_ACHIEVEMENT_UPDATED, callback);
    globalEventsEmitter.on(GlobalEventsEnum.ACHIEVEMENTS_ACHIEVEMENT_DELETED, callback);

    return () => {
      globalEventsEmitter.off(GlobalEventsEnum.ACHIEVEMENTS_ACHIEVEMENT_ADDED, callback);
      globalEventsEmitter.off(GlobalEventsEnum.ACHIEVEMENTS_ACHIEVEMENT_UPDATED, callback);
      globalEventsEmitter.off(GlobalEventsEnum.ACHIEVEMENTS_ACHIEVEMENT_DELETED, callback);
    };
  }, [isLoading, auth, user.id, refetch]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  if (!data || data.length === 0) {
    return <div className="text-muted-foreground">No achievements yet</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {data.map((achievement) => (
        <div key={achievement.key} className="flex flex-col gap-3 rounded-lg border-2 p-3">
          <div className="flex justify-between">
            <h5 className="text-lg">
              <span className="font-bold">{achievement.name}</span>
              <span className="text-sm"> (Level {achievement.level})</span>
            </h5>
            <div className="text-muted-foreground">
              {achievement.points}/{achievement.nextLevelPoints}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="bg-muted h-3 rounded-lg">
              <div
                className="bg-secondary-foreground h-full rounded-lg"
                style={{ width: `${achievement.nextLevelProgressPercentages}%` }}
              />
            </div>
            <div className="text-muted-foreground flex justify-between text-xs">
              <div>{achievement.currentLevelPoints}</div>
              <div>{achievement.nextLevelPoints}</div>
            </div>
          </div>
          <div className="text-muted-foreground text-sm">{achievement.description}</div>
        </div>
      ))}
    </div>
  );
}
