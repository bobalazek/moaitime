import { Goal } from '@moaitime/shared-common';

import GoalItemActions from './GoalItemActions';

export type GoalItemProps = {
  goal: Goal;
};

export default function GoalItem({ goal }: GoalItemProps) {
  return (
    <div className="flex justify-between">
      <div className="flex w-full justify-between">
        <h5>
          {goal.name}
          <div
            className="ml-2 inline-block h-2 w-2 rounded-full"
            style={{
              backgroundColor: goal.color ?? undefined,
              borderRadius: '50%',
            }}
          />
        </h5>
        <GoalItemActions goal={goal} />
      </div>
    </div>
  );
}
