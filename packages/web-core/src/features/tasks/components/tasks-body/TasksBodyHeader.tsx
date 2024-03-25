import TasksBodyHeaderFilterSelector from './TasksBodyHeaderFilterSelector';
import TasksBodyHeaderListSelector from './TasksBodyHeaderListSelector';

export default function TasksBodyHeader() {
  return (
    <div
      className="bg-background flex items-center justify-between border-b p-2"
      data-test="tasks--body-header"
    >
      <TasksBodyHeaderListSelector />
      <TasksBodyHeaderFilterSelector />
    </div>
  );
}
