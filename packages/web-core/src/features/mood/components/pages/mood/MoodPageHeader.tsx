import LayoutPageHeader from '../../../../core/components/layout/LayoutPageHeader';
import MoodPageHeaderButtons from './MoodPageHeaderButtons';

const MoodPageHeader = () => {
  return (
    <LayoutPageHeader testKey="mood" title="Mood">
      <MoodPageHeaderButtons />
    </LayoutPageHeader>
  );
};

export default MoodPageHeader;
