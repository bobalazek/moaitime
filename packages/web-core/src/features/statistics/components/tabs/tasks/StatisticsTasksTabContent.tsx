import TasksBasicsSection from './TasksBasicsSection';
import TasksCreatedSection from './TasksCreatedSection';

export default function StatisticsTasksTabContent() {
  return (
    <div className="space-y-4">
      <TasksBasicsSection />
      <TasksCreatedSection />
    </div>
  );
}
