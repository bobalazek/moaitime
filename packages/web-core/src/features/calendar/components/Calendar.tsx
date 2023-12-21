import { FaCalendarAlt } from 'react-icons/fa';

import { ErrorBoundary } from '../../core/components/ErrorBoundary';
import { useCalendarStore } from '../state/calendarStore';
import CalendarEditDialog from './calendar-edit-dialog/CalendarEditDialog';
import CalendarEntryEditDialog from './calendar-entry-edit-dialog/CalendarEntryEditDialog';
import CalendarDialog from './dialog/CalendarDialog';

export default function Calendar() {
  const { setDialogOpen } = useCalendarStore();

  return (
    <ErrorBoundary>
      <button
        className="text-xl text-white transition-all"
        data-test="calendar--dialog--trigger-button"
        onClick={() => {
          setDialogOpen(true);
        }}
      >
        <FaCalendarAlt className="text-3xl" />
      </button>
      <CalendarDialog />
      <CalendarEditDialog />
      <CalendarEntryEditDialog />
    </ErrorBoundary>
  );
}
