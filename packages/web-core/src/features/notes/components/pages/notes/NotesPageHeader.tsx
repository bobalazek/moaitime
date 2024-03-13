import LayoutPageHeader from '../../../../core/components/layout/LayoutPageHeader';
import UsageBadge from '../../../../core/components/UsageBadge';
import NotesPageHeaderButtons from './NotesPageHeaderButtons';

const NotesPageHeader = () => {
  return (
    <LayoutPageHeader
      testKey="notes"
      title={
        <div className="flex items-center gap-2">
          <div>Notes</div>
          <UsageBadge limitKey="notesMaxPerUserCount" usageKey="notesCount" />
        </div>
      }
    >
      <NotesPageHeaderButtons />
    </LayoutPageHeader>
  );
};

export default NotesPageHeader;
