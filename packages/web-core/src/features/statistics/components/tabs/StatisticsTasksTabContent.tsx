import TasksBasicsSection from './tasks/TasksBasicsSection';
import TasksCreatedSection from './tasks/TasksCreatedSection';

export default function StatisticsTasksTabContent() {
  return (
    <div className="space-y-4">
      <TasksBasicsSection />
      <TasksCreatedSection />
    </div>
  );
}
