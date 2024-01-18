import { useEventsStore } from '../../state/eventsStore';

export default function EventEditDialogBodyReadOnly() {
  const { selectedEvent } = useEventsStore();

  if (!selectedEvent) {
    return null;
  }

  return (
    <>
      <h2 className="text-2xl">{selectedEvent.title}</h2>
      {selectedEvent.description && (
        <>
          <h3 className="text-xl">Description</h3>
          <p>{selectedEvent.description}</p>
        </>
      )}
    </>
  );
}
