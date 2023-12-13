import { useNavigate } from 'react-router-dom';

import { Button, Card, CardDescription, CardHeader, CardTitle } from '@moaitime/web-ui';

import { ErrorBoundary } from '../components/ErrorBoundary';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <ErrorBoundary>
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-screen-sm">
          <CardHeader className="text-center">
            <CardTitle>404 Not Found</CardTitle>
            <CardDescription>Oh dear, you seem to be lost. Is everything alright?</CardDescription>
          </CardHeader>
          <CardHeader>
            <Button
              variant="default"
              onClick={() => {
                navigate('/');
              }}
            >
              Back to Home
            </Button>
          </CardHeader>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
