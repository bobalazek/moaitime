import { isEqual } from 'lodash';

import { Note, UpdateNote } from '@moaitime/shared-common';
import { Input } from '@moaitime/web-ui';
import { PlateEditor } from '@moaitime/web-ui-editor';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { useNotesStore } from '../../state/notesStore';

export const NoteEditor = () => {
  const { selectedNote, selectedNoteData, setSelectedNoteData } = useNotesStore();

  // Hacky workaround to clear re-instantiate the editor if the value changes,
  // because we got new content from the websocket
  let plateEditorKey = selectedNote ? selectedNote.id : 'new';
  if (
    selectedNote &&
    typeof (selectedNote as Note & { _forceReset?: boolean })._forceReset !== 'undefined'
  ) {
    plateEditorKey += `_${selectedNote.updatedAt}`;
  }

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
            if (isEqual(selectedNoteData?.content, value)) {
              return;
            }

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
