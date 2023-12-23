import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import NotesPageHeader from './notes/NotesPageHeader';

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
      <div className="flex flex-col" data-test="notes">
        <NotesPageHeader />
        <div className="p-4">TODO</div>
      </div>
    </ErrorBoundary>
  );
}
