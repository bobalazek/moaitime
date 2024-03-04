import LayoutPageHeader from '../../../../core/components/layout/LayoutPageHeader';
import HabitsPageHeaderButtons from './HabitsPageHeaderButtons';

const HabisPageHeader = () => {
  return (
    <LayoutPageHeader testKey="habits" title="Habits">
      <HabitsPageHeaderButtons />
    </LayoutPageHeader>
  );
};

export default HabisPageHeader;
