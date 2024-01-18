import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@moaitime/web-ui';

import { useEventsStore } from '../../state/eventsStore';
import EventEditDialogBody from './EventEditDialogBody';
import EventEditDialogBodyReadOnly from './EventEditDialogBodyReadOnly';

export default function EventEditDialog() {
  const { selectedEventDialogOpen, selectedEvent, setSelectedEventDialogOpen } = useEventsStore();

  const eventExists = !!selectedEvent?.id;
  const eventIsReadOnly = selectedEvent?.permissions?.canUpdate === false;

  return (
    <Dialog open={selectedEventDialogOpen} onOpenChange={setSelectedEventDialogOpen}>
      <DialogContent data-test="calendar--event-edit-dialog">
        {!eventIsReadOnly && (
          <>
            <DialogHeader>
              <DialogTitle>
                {eventExists ? `Edit "${selectedEvent.title}" Event` : 'New Event'}
              </DialogTitle>
            </DialogHeader>
            <EventEditDialogBody />
          </>
        )}
        {eventIsReadOnly && <EventEditDialogBodyReadOnly />}
      </DialogContent>
    </Dialog>
  );
}
