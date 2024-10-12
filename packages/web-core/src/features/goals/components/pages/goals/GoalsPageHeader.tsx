import LayoutPageHeader from '../../../../core/components/layout/LayoutPageHeader';
import GoalsPageHeaderButtons from './GoalsPageHeaderButtons';

const GoalsPageHeader = () => {
  return (
    <LayoutPageHeader testKey="goals" title="Goals">
      <GoalsPageHeaderButtons />
    </LayoutPageHeader>
  );
};

export default GoalsPageHeader;
