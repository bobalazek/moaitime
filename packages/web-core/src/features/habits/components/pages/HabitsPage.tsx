import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { useEscapeToHome } from '../../../core/hooks/useEscapeToHome';
import { useStateAndUrlSync } from '../../../core/hooks/useStateAndUrlSync';
import { useHabitsStore } from '../../state/habitsStore';
import HabitsPageHeader from './habits/HabitsPageHeader';
import HabitsPageMain from './habits/HabitsPageMain';

export default function HabitsPage() {
  const { selectedDate, setSelectedDate } = useHabitsStore();
  const location = useLocation();
  const [targetUri, setTargetUri] = useState(`${location.pathname}${location.search}`);
  const isInitializedRef = useRef(false);

  useEscapeToHome();

  useEffect(() => {
    document.title = 'Habits | MoaiTime';
  }, []);

  const updateStateByUrl = useDebouncedCallback(() => {
    const params = new URLSearchParams(location.search);
    const newSelectedDate = params.get('selectedDate');
    if (newSelectedDate && newSelectedDate !== format(selectedDate, 'yyyy-MM-dd')) {
      setSelectedDate(new Date(newSelectedDate));
    }
  }, 10);

  useEffect(() => {
    if (isInitializedRef.current) {
      return;
    }

    isInitializedRef.current = true;

    updateStateByUrl();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
    const newTargetUri = `/habits?selectedDate=${selectedDateString}`;

    setTargetUri(newTargetUri);
  }, [setTargetUri, selectedDate]);

  useStateAndUrlSync(updateStateByUrl, targetUri);

  return (
    <ErrorBoundary>
      <div data-test="focus">
        <HabitsPageHeader />
        <HabitsPageMain />
      </div>
    </ErrorBoundary>
  );
}
