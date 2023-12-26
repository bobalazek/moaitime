import { Input } from '@moaitime/web-ui';
import { PlateEditor } from '@moaitime/web-ui-editor';

import { useNotesStore } from '../../state/notesStore';

export const NoteEditor = () => {
  const { selectedNoteData, setSelectedNoteData } = useNotesStore();

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <Input
          className="p-8 text-2xl"
          placeholder="Title"
          value={selectedNoteData?.title ?? ''}
          onChange={(event) => {
            setSelectedNoteData({
              ...selectedNoteData,
              title: event.target.value,
            });
          }}
        />
      </div>
      <PlateEditor
        value={selectedNoteData?.content}
        onChange={(value) => {
          setSelectedNoteData({
            ...selectedNoteData,
            content: value,
          });
        }}
      />
    </div>
  );
};

export default NoteEditor;
