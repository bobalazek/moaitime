import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import NotesPageHeader from './notes/NotesPageHeader';
import NotesPageSidebar from './notes/NotesPageSidebar';

export default function NotesPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();

        navigate('/');
      }
    };

    document.addEventListener('keydown', onKeydown);

    return () => document.removeEventListener('keydown', onKeydown);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ErrorBoundary>
      <div className="flex h-screen flex-col" data-test="notes">
        <NotesPageHeader />
        <div className="flex h-full flex-grow">
          <NotesPageSidebar />
          <main className="p-4">No note selected</main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
