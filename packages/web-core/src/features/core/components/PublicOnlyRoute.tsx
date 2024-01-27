import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuthStore } from '../../auth/state/authStore';

export type PublicOnlyRouteProps = {
  children: ReactNode;
};

export default function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { auth } = useAuthStore();
  const location = useLocation();

  if (auth) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
