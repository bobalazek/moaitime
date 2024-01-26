import NotesBasicsSection from './notes/NotesBasicsSection';
import NotesCreatedSection from './notes/NotesCreatedSection';

export default function StatisticsNotesTabContent() {
  return (
    <div className="space-y-4">
      <NotesBasicsSection />
      <NotesCreatedSection />
    </div>
  );
}
