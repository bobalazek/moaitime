import LayoutPageHeader from '../../../../core/components/layout/LayoutPageHeader';
import { useHabitsStore } from '../../../state/habitsStore';
import HabitsPageHeaderButtons from './HabitsPageHeaderButtons';

const HabisPageHeader = () => {
  const { selectedDate } = useHabitsStore();

  return (
    <LayoutPageHeader
      testKey="habits"
      title={`Habits for ${selectedDate.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })}`}
    >
      <HabitsPageHeaderButtons />
    </LayoutPageHeader>
  );
};

export default HabisPageHeader;
