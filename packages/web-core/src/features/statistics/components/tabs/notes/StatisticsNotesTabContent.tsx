import NotesBasicsSection from './NotesBasicsSection';
import NotesCreatedSection from './NotesCreatedSection';

export default function StatisticsNotesTabContent() {
  return (
    <div className="flex flex-col gap-4">
      <NotesBasicsSection />
      <NotesCreatedSection />
    </div>
  );
}
