import TasksBodyHeaderFilterSelector from './TasksBodyHeaderFilterSelector';
import TasksBodyHeaderListSelector from './TasksBodyHeaderListSelector';

export default function TasksBodyHeader() {
  return (
    <div className="mb-2 flex items-center justify-between" data-test="tasks--body-header">
      <TasksBodyHeaderListSelector />
      <TasksBodyHeaderFilterSelector />
    </div>
  );
}
