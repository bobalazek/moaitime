import LayoutPageHeader from '../../../../core/components/layout/LayoutPageHeader';
import HabitsPageHeaderButtons from './HabbitsPageHeaderButtons';

const HabisPageHeader = () => {
  return (
    <LayoutPageHeader testKey="habits" title="Habits">
      <HabitsPageHeaderButtons />
    </LayoutPageHeader>
  );
};

export default HabisPageHeader;
