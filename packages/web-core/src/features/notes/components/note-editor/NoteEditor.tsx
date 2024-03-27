import { UpdateNote } from '@moaitime/shared-common';
import { Input } from '@moaitime/web-ui';
import { PlateEditor } from '@moaitime/web-ui-editor';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { useNotesStore } from '../../state/notesStore';

export const NoteEditor = () => {
  const { selectedNote, selectedNoteData, setSelectedNoteData } = useNotesStore();

  const plateEditorKey = selectedNote ? selectedNote.id : 'new';

  return (
    <div className="flex select-none flex-col" data-test="note-editor">
      <div className="mb-4">
        <Input
          autoFocus
          className="p-8 text-2xl"
          placeholder="Title"
          value={selectedNoteData?.title ?? ''}
          onChange={(event) => {
            setSelectedNoteData({
              ...selectedNoteData,
              title: event.target.value,
            } as UpdateNote);
          }}
          data-test="note-editor--title"
        />
      </div>
      <ErrorBoundary>
        <PlateEditor
          key={plateEditorKey}
          value={selectedNoteData?.content}
          onChange={(value) => {
            setSelectedNoteData({
              ...selectedNoteData,
              content: value,
            } as UpdateNote);
          }}
          editorProps={{
            'data-test': 'note-editor--content',
          }}
        />
      </ErrorBoundary>
    </div>
  );
};

export default NoteEditor;
