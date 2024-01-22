import TasksForm from '../tasks-list/TasksForm';
import TasksList from '../tasks-list/TasksList';
import TasksBodyHeader from './TasksBodyHeader';

export default function TasksBody() {
  return (
    <div data-test="tasks--body">
      <TasksBodyHeader />
      <TasksList />
      <TasksForm />
    </div>
  );
}
