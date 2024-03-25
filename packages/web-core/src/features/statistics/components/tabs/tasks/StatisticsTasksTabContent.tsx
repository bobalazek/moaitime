import TasksBasicsSection from './TasksBasicsSection';
import TasksCreatedSection from './TasksCreatedSection';

export default function StatisticsTasksTabContent() {
  return (
    <div className="flex flex-col gap-4">
      <TasksBasicsSection />
      <TasksCreatedSection />
    </div>
  );
}
