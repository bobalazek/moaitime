import { isMobile } from 'react-device-detect';

import LayoutPageHeader from '../../../../core/components/layout/LayoutPageHeader';
import { useHabitsStore } from '../../../state/habitsStore';
import HabitsPageHeaderButtons from './HabitsPageHeaderButtons';

const HabitsPageHeader = () => {
  const { selectedDate } = useHabitsStore();

  const date = selectedDate.toLocaleDateString(undefined, {
    weekday: isMobile ? 'short' : 'long',
    month: isMobile ? 'short' : 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const title = isMobile ? date : `Habits for ${date}`;

  return (
    <LayoutPageHeader testKey="habits" title={title}>
      <HabitsPageHeaderButtons />
    </LayoutPageHeader>
  );
};

export default HabitsPageHeader;
