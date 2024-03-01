import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

import { GlobalEventsEnum, PublicUser } from '@moaitime/shared-common';

import { useAuthStore } from '../../../auth/state/authStore';
import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';
import { globalEventsEmitter } from '../../../core/state/globalEventsEmitter';
import { useUserAchievementsQuery } from '../../hooks/useUserAchievementsQuery';

const animationVariants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -100,
  },
};

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
      <AnimatePresence>
        {data.map((achievement) => (
          <motion.div
            key={achievement.key}
            layout
            initial="initial"
            animate="animate"
            exit="exit"
            variants={animationVariants}
            className="flex flex-col gap-3 rounded-lg border-2 p-3"
          >
            <div className="flex justify-between">
              <h5 className="text-lg">
                <span className="font-bold">{achievement.name}</span>
                <span className="text-sm"> (Level {achievement.level})</span>
              </h5>
              <div className="text-muted-foreground">
                {achievement.points}/{achievement.nextLevelPoints}
              </div>
            </div>
            <div className="relative flex flex-col gap-1">
              <div className="bg-muted h-5 rounded-lg ">
                <div
                  className={clsx(
                    'h-full rounded-lg',
                    !achievement.hasReachedMaxProgress && 'bg-yellow-400',
                    achievement.hasReachedMaxProgress && 'bg-green-500'
                  )}
                  style={{
                    width: `${achievement.nextLevelProgressPercentage}%`,
                  }}
                />
              </div>
              {achievement.currentLevelPoints !== achievement.nextLevelPoints && (
                <div
                  className="absolute flex w-full justify-between px-2 py-0.5 text-xs text-white"
                  style={{
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 1)',
                  }}
                >
                  <div>{achievement.currentLevelPoints}</div>
                  <div>{achievement.nextLevelPoints}</div>
                </div>
              )}
            </div>
            <div className="text-muted-foreground text-sm">{achievement.description}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
