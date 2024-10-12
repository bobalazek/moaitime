import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@moaitime/web-ui';

import { useGoalsStore } from '../../state/goalsStore';
import GoalItem from '../goal-item/GoalItem';

export default function DeletedGoalsDialog() {
  const { deletedGoals, deletedGoalsDialogOpen, setDeletedGoalsDialogOpen } = useGoalsStore();

  return (
    <Dialog open={deletedGoalsDialogOpen} onOpenChange={setDeletedGoalsDialogOpen}>
      <DialogContent data-test="goals--deleted-goals-dialog">
        <DialogHeader>
          <DialogTitle>Deleted Goals</DialogTitle>
        </DialogHeader>
        {deletedGoals.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <div className="text-muted-foreground text-center">No deleted goals</div>
          </div>
        )}
        {deletedGoals.length > 0 && (
          <div>
            {deletedGoals.map((goal) => (
              <GoalItem key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
