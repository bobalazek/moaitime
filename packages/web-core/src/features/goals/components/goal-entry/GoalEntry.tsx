import { format, isAfter } from 'date-fns';

import { Goal } from '@moaitime/shared-common';
import { cn } from '@moaitime/web-ui';

import { getLighterBackgroundColor, getTextColor } from '../../../core/utils/ColorHelpers';
import { GoalEntryActions } from './GoalEntryActions';

export type GoalEntryProps = {
  goal: Goal;
};

export default function GoalEntry({ goal }: GoalEntryProps) {
  const now = new Date();
  const backgroundColor = goal.color ?? '#aaaaaa';
  const lighterBackgroundColor = getLighterBackgroundColor(backgroundColor, 0.15);
  const textColor = getTextColor(backgroundColor);
  const targetCompletedAt = goal.targetCompletedAt ? new Date(goal.targetCompletedAt) : null;
  const completedAt = goal.completedAt ? new Date(goal.completedAt) : null;
  const isOverdue = targetCompletedAt && !completedAt && isAfter(now, targetCompletedAt);

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
          <h5 className="flex items-center gap-2 text-xl font-bold">{goal.name}</h5>
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
          {targetCompletedAt && (
            <div className={cn('text-sm', isOverdue && 'text-destructive')}>
              Target completion: <b>{format(targetCompletedAt, 'MMM d, yyyy')}</b>
            </div>
          )}
          {completedAt && (
            <div className="text-sm">
              Completed: <b>{format(completedAt, 'MMM d, yyyy h:mm a')}</b>
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
