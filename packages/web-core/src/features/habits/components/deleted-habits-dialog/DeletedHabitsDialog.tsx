import { Dialog, DialogContent, DialogHeader, DialogTitle, ScrollArea } from '@moaitime/web-ui';

import { useHabitsStore } from '../../state/habitsStore';
import HabitItem from '../habit-item/HabitItem';

export default function DeletedHabitsDialog() {
  const { deletedHabits, deletedHabitsDialogOpen, setDeletedHabitsDialogOpen } = useHabitsStore();

  return (
    <Dialog open={deletedHabitsDialogOpen} onOpenChange={setDeletedHabitsDialogOpen}>
      <DialogContent data-test="habits--deleted-habits-dialog">
        <DialogHeader>
          <DialogTitle>Deleted Habits</DialogTitle>
        </DialogHeader>
        {deletedHabits.length === 0 && (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="text-muted-foreground text-center">No deleted habits</div>
          </div>
        )}
        {deletedHabits.length > 0 && (
          <ScrollArea className="max-h-[calc(100vh-12rem)]">
            {deletedHabits.map((habit) => (
              <HabitItem key={habit.id} habit={habit} />
            ))}
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
