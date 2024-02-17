import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { Loader } from '../../../core/components/Loader';
import { useEscapeToHome } from '../../../core/hooks/useEscapeToHome';
import NotFoundPage from '../../../core/pages/NotFoundPage';
import { useUsersViewQuery } from '../../hooks/useUsersViewQuery';
import SocialPageHeader from './layout/SocialPageHeader';
import SocialUsersViewPageContent from './social-users-view/SocialUsersViewPageContent';

export default function SocialUsersViewPage() {
  useEscapeToHome();
  const params = useParams<{ userUsername: string }>();

  const { isLoading, error, data, refetch } = useUsersViewQuery(params.userUsername!);

  useEffect(() => {
    document.title = data?.displayName
      ? `${data.displayName} | Users | Social | MoaiTime`
      : `Users | Social | MoaiTime`;
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }

  if (!data || !params.userUsername) {
    return <NotFoundPage />;
  }

  if (error || !data) {
    return <ErrorAlert error={error} />;
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen flex-col" data-test="social--users-view">
        <SocialPageHeader />
        <SocialUsersViewPageContent user={data} refetch={refetch} />
      </div>
    </ErrorBoundary>
  );
}
