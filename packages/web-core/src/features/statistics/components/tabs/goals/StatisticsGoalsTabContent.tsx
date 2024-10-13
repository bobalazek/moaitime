import NotesBasicsSection from './GoalsBasicsSection';
import NotesCreatedSection from './GoalsCreatedSection';

export default function StatisticsGoalsTabContent() {
  return (
    <div className="flex flex-col gap-4">
      <NotesBasicsSection />
      <NotesCreatedSection />
    </div>
  );
}
