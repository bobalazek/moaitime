import { UsersIcon } from 'lucide-react';

import { Task } from '@moaitime/shared-common';

const TaskItemUsers = ({ task }: { task: Task }) => {
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
          return (
            <span key={user.id} data-test="tasks--task--user">
              {user.displayName}
            </span>
          );
        })}
      </span>
    </div>
  );
};

export default TaskItemUsers;
