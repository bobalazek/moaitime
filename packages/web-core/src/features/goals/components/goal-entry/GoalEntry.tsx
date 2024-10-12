import { Goal } from '@moaitime/shared-common';

import { getLighterBackgroundColor, getTextColor } from '../../../core/utils/ColorHelpers';
import { GoalEntryActions } from './GoalEntryActions';

export type GoalEntryProps = {
  goal: Goal;
};

export default function GoalEntry({ goal }: GoalEntryProps) {
  const backgroundColor = goal.color ?? '#aaaaaa';
  const lighterBackgroundColor = getLighterBackgroundColor(backgroundColor, 0.15);
  const textColor = getTextColor(backgroundColor);

  return (
    <div
      className="relative flex w-full flex-col flex-wrap rounded-lg border p-4"
      style={{
        color: textColor,
        borderColor: backgroundColor ?? undefined,
        backgroundColor: lighterBackgroundColor,
      }}
    >
      <div className="z-10 flex w-full flex-wrap items-center justify-between gap-2 md:flex-nowrap">
        <div className="flex flex-col">
          <h5 className="flex items-center gap-2 text-xl font-bold">
            <span>{goal.name}</span>
          </h5>
          {goal.description && (
            <div
              className="text-sm"
              style={{
                color: textColor,
              }}
            >
              {goal.description}
            </div>
          )}
        </div>
        <div>
          <GoalEntryActions goal={goal} />
        </div>
      </div>
    </div>
  );
}
