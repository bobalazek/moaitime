import { PublicUser } from '@moaitime/shared-common';

import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';
import { useUserAchievementsQuery } from '../../hooks/useUserAchievementsQuery';

export type UserAchievementsGridProps = {
  user: PublicUser;
};

export default function UserAchievementsGrid({ user }: UserAchievementsGridProps) {
  const { isLoading, error, data } = useUserAchievementsQuery(user.id);

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
          <div className="bg-muted h-3 rounded-lg">
            <div
              className="bg-secondary-foreground h-full rounded-lg"
              style={{ width: `${achievement.nextLevelProgressPercentages}%` }}
            />
          </div>
          <div className="text-muted-foreground text-sm">{achievement.description}</div>
        </div>
      ))}
    </div>
  );
}
