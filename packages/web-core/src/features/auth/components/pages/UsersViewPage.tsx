import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { Loader } from '../../../core/components/Loader';
import { useEscapeToHome } from '../../../core/hooks/useEscapeToHome';
import NotFoundPage from '../../../core/pages/NotFoundPage';
import { useUsersViewQuery } from '../../hooks/useUsersViewQuery';
import UsersViewPageContent from './users-view/UsersViewPageContent';
import UsersViewPageHeader from './users-view/UsersViewPageHeader';

export default function UsersViewPage() {
  useEscapeToHome();
  const params = useParams<{ userUsername: string }>();

  const { isLoading, error, data } = useUsersViewQuery(params.userUsername!);

  useEffect(() => {
    document.title = data?.displayName
      ? `${data.displayName} | Users | MoaiTime`
      : `Users | MoaiTime`;
  }, [data]);

  if (!data || !params.userUsername) {
    return <NotFoundPage />;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error || !data) {
    return <ErrorAlert error={error} />;
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen flex-col" data-test="users-view">
        <UsersViewPageHeader />
        <UsersViewPageContent user={data} />
      </div>
    </ErrorBoundary>
  );
}
