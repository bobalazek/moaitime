import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import { useEventListener } from 'usehooks-ts';

import { isValidUuid } from '@moaitime/shared-common';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { useStateAndUrlSync } from '../../../core/hooks/useStateAndUrlSync';
import { useNotesStore } from '../../state/notesStore';
import NotesPageHeader from './notes/NotesPageHeader';
import NotesPageMain from './notes/NotesPageMain';
import NotesPageSidebar from './notes/NotesPageSidebar';

export default function NotesPage() {
  const {
    getNote,
    selectedNote,
    selectedNoteData,
    selectedNoteDataChanged,
    setSelectedNote,
    setSelectedNoteData,
    setNotesIncludeDeleted,
    reloadNotes,
  } = useNotesStore();
  const location = useLocation();
  const [targetUri, setTargetUri] = useState(`${location.pathname}${location.search}`);
  const isInitializedRef = useRef(false);
  const isInitialFetchDoneRef = useRef(false);
  const selectedNoteDatadRef = useRef(selectedNoteData);
  const selectedNoteDataChangedRef = useRef(selectedNoteDataChanged);

  useEffect(() => {
    document.title = 'Notes | MoaiTime';
  }, []);

  useEventListener('focus', async () => {
    reloadNotes();

    if (selectedNote?.id) {
      const newSelectedNote = await getNote(selectedNote.id);
      setSelectedNote({ ...newSelectedNote, _forceReset: true }, true);
    }
  });

  const updateStateByUrl = useDebouncedCallback(async () => {
    const noteId = location.pathname.replace('/notes/', '');
    if (isValidUuid(noteId)) {
      try {
        const newSelectedNote = await getNote(noteId);
        setSelectedNote(newSelectedNote, true);

        if (newSelectedNote && newSelectedNote.deletedAt) {
          setNotesIncludeDeleted(true);
        }
      } catch (error) {
        setTargetUri('/notes');
      }
    }

    isInitialFetchDoneRef.current = true;
  }, 10);

  useEffect(() => {
    if (isInitializedRef.current) {
      return;
    }

    isInitializedRef.current = true;

    updateStateByUrl();
    reloadNotes();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();

        if (selectedNoteDataChangedRef.current) {
          const response = confirm('You have unsaved changes. Are you sure you want to leave?');
          if (!response) {
            return;
          }
        }

        if (selectedNoteDatadRef.current) {
          setSelectedNoteData(null);

          return;
        }

        setTargetUri('/');
      }
    };

    document.addEventListener('keydown', onKeydown);

    return () => document.removeEventListener('keydown', onKeydown);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    selectedNoteDatadRef.current = selectedNoteData;
    selectedNoteDataChangedRef.current = selectedNoteDataChanged;
  }, [selectedNoteData, selectedNoteDataChanged]);

  useEffect(() => {
    // We want to prevent this executing and setting the targetUrl to /notes,
    // as we do not the fetch does happen asynchronously above, so we need to wait until
    // that resolves.
    if (!isInitialFetchDoneRef.current) {
      return;
    }

    const newTargetUri = selectedNote?.id ? `/notes/${selectedNote.id}` : `/notes`;

    setTargetUri(newTargetUri);
  }, [setTargetUri, selectedNote]);

  useStateAndUrlSync(updateStateByUrl, targetUri);

  return (
    <ErrorBoundary>
      <div className="flex h-screen flex-col" data-test="notes">
        <NotesPageHeader />
        <div className="flex h-full flex-grow overflow-hidden">
          <NotesPageSidebar />
          <NotesPageMain />
        </div>
      </div>
    </ErrorBoundary>
  );
}
