import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { useNotesStore } from '../../state/notesStore';
import NotesPageHeader from './notes/NotesPageHeader';
import NotesPageMain from './notes/NotesPageMain';
import NotesPageSidebar from './notes/NotesPageSidebar';

export default function NotesPage() {
  const { loadNotes, selectedNoteDataChanged } = useNotesStore();
  const isInitializedRef = useRef(false);
  const selectedNoteDataChangedRef = useRef(selectedNoteDataChanged);
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitializedRef.current) {
      return;
    }

    isInitializedRef.current = true;

    loadNotes();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Not really sure why we need separate effect for this,
    // but otherwise it doesn't work.

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();

        if (selectedNoteDataChangedRef.current) {
          const response = confirm('You have unsaved changes. Are you sure you want to leave?');
          if (!response) {
            return;
          }
        }

        navigate('/');
      }
    };

    document.addEventListener('keydown', onKeydown);

    return () => document.removeEventListener('keydown', onKeydown);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    selectedNoteDataChangedRef.current = selectedNoteDataChanged;
  }, [selectedNoteDataChanged]);

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
