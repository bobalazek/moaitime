import { useEffect, useState } from 'react';

import {
  Button,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
} from '@moaitime/web-ui';

import { useTasksStore } from '../../state/tasksStore';

export default function TaskUsersNudgeDialog() {
  const { selectedTask, usersNudgeDialogOpen, setUsersNudgeDialogOpen } = useTasksStore();

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  useEffect(() => {
    if (selectedTask) {
      setSelectedUserIds(selectedTask.users?.map((user) => user.id) ?? []);
    }
  }, [selectedTask]);

  const onSubmitButtonClick = () => {
    console.log('Nudge users');
  };

  return (
    <Dialog open={usersNudgeDialogOpen} onOpenChange={setUsersNudgeDialogOpen}>
      <DialogContent data-test="tasks--tags-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center align-middle">
            <span>Nudge Users</span>
          </DialogTitle>
          <DialogDescription>Who do you want to nudge?</DialogDescription>
        </DialogHeader>
        {!selectedTask && (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="text-center">
              <div className="text-xl">No task selected</div>
            </div>
          </div>
        )}
        {selectedTask && (
          <>
            <div>
              {selectedTask.users?.length === 0 && (
                <div className="flex flex-col items-center justify-center p-4">
                  <div className="text-center">
                    <div className="text-xl">No users assigned yet</div>
                  </div>
                </div>
              )}
              {selectedTask.users && selectedTask.users.length > 0 && (
                <div className="flex flex-col gap-4">
                  {selectedTask.users.map((user) => {
                    return (
                      <div key={user.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`task-users-nudge-dialog--user-${user.id}`}
                          checked={selectedUserIds.includes(user.id)}
                          onCheckedChange={(check) => {
                            setSelectedUserIds(
                              check
                                ? [...selectedUserIds, user.id]
                                : selectedUserIds.filter((e) => e !== user.id)
                            );
                          }}
                        />
                        <Label htmlFor={`task-users-nudge-dialog--user-${user.id}`}>
                          <span>{user.displayName}</span>
                          <small className="text-muted-foreground"> ({user.email})</small>
                        </Label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button type="submit" variant="default" onClick={onSubmitButtonClick}>
                Nudge Users
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
