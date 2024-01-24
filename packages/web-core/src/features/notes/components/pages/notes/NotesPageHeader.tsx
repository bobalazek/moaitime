import LayoutPageHeader from '../../../../core/components/layout/LayoutPageHeader';
import NotesPageHeaderButtons from './NotesPageHeaderButtons';

const NotesPageHeader = () => {
  return (
    <LayoutPageHeader testKey="notes" title="Notes">
      <NotesPageHeaderButtons />
    </LayoutPageHeader>
  );
};

export default NotesPageHeader;
