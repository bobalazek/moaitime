import { useListsStore } from '../../state/listsStore';
import TasksForm from '../tasks-list/TasksForm';
import TasksList from '../tasks-list/TasksList';
import TasksBodyHeader from './TasksBodyHeader';

export default function TasksBody() {
  const { selectedList } = useListsStore();

  return (
    <div data-test="tasks--body">
      <TasksBodyHeader />
      {!selectedList && (
        <p className="p-4 text-center text-gray-400">Select or create a list to get started.</p>
      )}
      {selectedList && (
        <>
          <TasksList />
          <TasksForm />
        </>
      )}
    </div>
  );
}
