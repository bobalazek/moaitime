import { Habit } from '@moaitime/shared-common';

import HabitItemActions from './HabitItemActions';

export type HabitItemProps = {
  habit: Habit;
};

export default function HabitItem({ habit }: HabitItemProps) {
  return (
    <div className="flex justify-between">
      <div className="flex w-full justify-between">
        <h5>
          {habit.name}
          <div
            className="ml-2 inline-block h-2 w-2 rounded-full"
            style={{
              backgroundColor: habit.color ?? undefined,
              borderRadius: '50%',
            }}
          />
        </h5>
        <HabitItemActions habit={habit} />
      </div>
    </div>
  );
}
