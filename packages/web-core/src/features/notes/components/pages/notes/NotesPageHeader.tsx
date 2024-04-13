import LayoutPageHeader from '../../../../core/components/layout/LayoutPageHeader';
import UsageBadge from '../../../../core/components/UsageBadge';
import NotesPageHeaderButtons from './NotesPageHeaderButtons';

const NotesPageHeader = () => {
  return (
    <LayoutPageHeader
      testKey="notes"
      title={
        <div className="flex items-center gap-4">
          <div>Notes</div>
          <div className="hidden md:block">
            <UsageBadge limitKey="notesMaxPerUserCount" usageKey="notesCount" />
          </div>
        </div>
      }
    >
      <NotesPageHeaderButtons />
    </LayoutPageHeader>
  );
};

export default NotesPageHeader;
