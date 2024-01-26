import NotesBasicsSection from './NotesBasicsSection';
import NotesCreatedSection from './NotesCreatedSection';

export default function StatisticsNotesTabContent() {
  return (
    <div className="space-y-4">
      <NotesBasicsSection />
      <NotesCreatedSection />
    </div>
  );
}
