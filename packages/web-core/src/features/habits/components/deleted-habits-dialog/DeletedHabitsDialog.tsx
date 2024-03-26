import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@moaitime/web-ui';

import { useHabitsStore } from '../../state/habitsStore';
import HabitItem from '../habit-item/HabitItem';

export default function DeletedHabitsDialog() {
  const { deletedHabits, deletedHabitsDialogOpen, setDeletedHabitsDialogOpen } = useHabitsStore();

  return (
    <Dialog open={deletedHabitsDialogOpen} onOpenChange={setDeletedHabitsDialogOpen}>
      <DialogContent data-test="habits--deleted-habits-dialog" className="overflow-auto">
        <DialogHeader>
          <DialogTitle>Deleted Habits</DialogTitle>
        </DialogHeader>
        {deletedHabits.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <div className="text-muted-foreground text-center">No deleted habits</div>
          </div>
        )}
        {deletedHabits.length > 0 && (
          <div>
            {deletedHabits.map((habit) => (
              <HabitItem key={habit.id} habit={habit} />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
