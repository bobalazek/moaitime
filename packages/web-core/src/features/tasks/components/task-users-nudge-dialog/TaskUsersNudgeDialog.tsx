import { useEffect, useState } from 'react';

import { areArraysEqual } from '@moaitime/shared-common';
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
  sonnerToast,
} from '@moaitime/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';
import { useTeamsStore } from '../../../teams/state/teamsStore';
import { useTasksStore } from '../../state/tasksStore';

export default function TaskUsersNudgeDialog() {
  const { auth } = useAuthStore();
  const { joinedTeamMembers } = useTeamsStore();
  const { selectedTask, usersNudgeDialogOpen, setUsersNudgeDialogOpen, nudgedTask } =
    useTasksStore();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const myUserId = auth?.user?.id;
  const teamUsers = joinedTeamMembers?.map((member) => member.user!);

  useEffect(() => {
    if (!selectedTask) {
      return;
    }

    const newSelectedUserIds = (selectedTask.users?.map((user) => user.id) ?? []).filter(
      (id) => id !== myUserId && !!teamUsers?.find((user) => user.id === id)
    );

    if (!areArraysEqual(newSelectedUserIds, selectedUserIds)) {
      setSelectedUserIds(newSelectedUserIds);
    }
  }, [selectedUserIds, selectedTask, myUserId, teamUsers]);

  const onSubmitButtonClick = async () => {
    try {
      await nudgedTask(selectedTask!.id, selectedUserIds);

      sonnerToast.success('Users nudged successfully', {
        description: 'The users have been nudged successfully',
      });

      setUsersNudgeDialogOpen(false);
    } catch (error) {
      // Already handled in the store
    }
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
              {teamUsers && teamUsers.length > 0 && (
                <div className="flex flex-col gap-4">
                  {teamUsers.map((user) => {
                    const checked = selectedUserIds.includes(user.id) && user.id !== myUserId;

                    return (
                      <div key={user.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`tasks--task-users-nudge-dialog--user-${user.id}`}
                          checked={checked}
                          onCheckedChange={(check) => {
                            setSelectedUserIds(
                              check
                                ? [...selectedUserIds, user.id]
                                : selectedUserIds.filter((e) => e !== user.id)
                            );
                          }}
                          disabled={user.id === myUserId}
                        />
                        <Label htmlFor={`tasks--task-users-nudge-dialog--user-${user.id}`}>
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
