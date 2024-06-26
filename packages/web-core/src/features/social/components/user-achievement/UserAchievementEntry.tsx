import { clsx } from 'clsx';

import { UserAchievement } from '@moaitime/shared-common';

export type UserAchievementEntryProps = {
  userAchievement: UserAchievement;
};

export default function UserAchievementEntry({ userAchievement }: UserAchievementEntryProps) {
  return (
    <div
      key={userAchievement.key}
      className="bg-background flex flex-col gap-3 rounded-lg border-2 p-3 shadow-md"
      data-test="social--user-achievements-grid--user-achievement"
      data-achievement-key={userAchievement.key}
      data-achievement-level={userAchievement.level}
      data-achievement-points={userAchievement.points}
    >
      <div className="flex justify-between">
        <h5 className="text-lg">
          <span className="font-bold">{userAchievement.name}</span>
          <span className="text-sm"> (Level {userAchievement.level})</span>
        </h5>
        <div className="text-muted-foreground">
          {userAchievement.points}/{userAchievement.nextLevelPoints}
        </div>
      </div>
      <div className="relative flex flex-col gap-1">
        <div className="bg-muted h-5 rounded-lg ">
          <div
            className={clsx(
              'h-full rounded-lg',
              !userAchievement.hasReachedMaxProgress && 'bg-yellow-400 dark:bg-yellow-600',
              userAchievement.hasReachedMaxProgress && 'bg-green-500 dark:bg-green-600'
            )}
            style={{
              width: `${userAchievement.nextLevelProgressPercentage}%`,
            }}
          />
        </div>
        {userAchievement.currentLevelPoints !== userAchievement.nextLevelPoints && (
          <div className="text-muted-foreground absolute flex h-5 w-full items-center justify-between px-2 text-xs dark:text-gray-100">
            <div>{userAchievement.currentLevelPoints}</div>
            <div>{userAchievement.nextLevelPoints}</div>
          </div>
        )}
      </div>
      <div className="text-muted-foreground text-sm">{userAchievement.description}</div>
    </div>
  );
}
