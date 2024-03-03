import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

import { GlobalEventsEnum, PublicUser } from '@moaitime/shared-common';

import { useAuthStore } from '../../../auth/state/authStore';
import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';
import { globalEventsEmitter } from '../../../core/state/globalEventsEmitter';
import { useUserAchievementsQuery } from '../../hooks/useUserAchievementsQuery';
import UserAchievementEntry from '../user-achievement/UserAchievementEntry';

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
    <div
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
      data-test="social--user-achievements-grid"
    >
      <AnimatePresence>
        {data.map((achievement) => (
          <motion.div
            key={achievement.key}
            layout
            initial="initial"
            animate="animate"
            exit="exit"
            variants={animationVariants}
          >
            <UserAchievementEntry userAchievement={achievement} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
