import { UsersIcon } from 'lucide-react';

import { Task } from '@moaitime/shared-common';

import { useTeamsStore } from '../../../teams/state/teamsStore';

const TaskItemUsers = ({ task }: { task: Task }) => {
  const { joinedTeamMembers } = useTeamsStore();

  if (!task.users?.length) {
    return null;
  }

  return (
    <div
      className="flex items-center space-x-1 align-middle text-xs"
      data-test="tasks--task--users-text"
    >
      <UsersIcon size={12} />
      <span className="flex gap-2">
        {task.users.map((user) => {
          const joinedTeamMember = joinedTeamMembers.find(
            (teamMember) => teamMember.userId === user.id
          );

          return (
            <span
              key={user.id}
              className="bg-primary text-primary-foreground inline-block rounded-lg px-[5px] py-[1px]"
              data-test="tasks--task--user"
            >
              {user.displayName}
              {joinedTeamMember?.displayName && ` "${joinedTeamMember.displayName}"`}
            </span>
          );
        })}
      </span>
    </div>
  );
};

export default TaskItemUsers;
