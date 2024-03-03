import { Habit } from '@moaitime/shared-common';

import HabitEntryActions from './HabitEntryActions';

export default function HabitEntry({ habit }: { habit: Habit }) {
  return (
    <div
      className="rounded-lg border-2 px-3 py-2 text-left"
      style={{
        borderColor: habit.color ?? undefined,
      }}
    >
      <div className="flex justify-between">
        <div className="flex w-full justify-between">
          <h5 className="text-lg font-bold">{habit.name}</h5>
          <HabitEntryActions habit={habit} />
        </div>
      </div>
      {habit.description && (
        <div className="text-muted-foreground text-xs">{habit.description}</div>
      )}
    </div>
  );
}
