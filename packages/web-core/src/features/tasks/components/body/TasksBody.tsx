import { useTasksStore } from '../../state/tasksStore';
import TasksForm from '../tasks/TasksForm';
import TasksList from '../tasks/TasksList';
import TasksBodyHeader from './TasksBodyHeader';

export default function TasksBody() {
  const { selectedList } = useTasksStore();

  return (
    <div data-test="tasks--body">
      <TasksBodyHeader />
      <div className="w-[360px]">
        {!selectedList && <p className="p-4 text-center text-gray-400">Select or create a list to get started.</p>}
        {selectedList && (
          <>
            <TasksList />
            <TasksForm />
          </>
        )}
      </div>
    </div>
  );
}
