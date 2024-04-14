import { LoaderIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@moaitime/web-ui';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { ErrorResponse } from '../../../core/errors/ErrorResponse';
import { useAuthStore } from '../../state/authStore';

export default function AuthConfirmEmailPage() {
  const { confirmEmail } = useAuthStore();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const isCheckingRef = useRef(false);

  useEffect(() => {
    if (isCheckingRef.current) {
      return;
    }

    isCheckingRef.current = true;

    const token = searchParams.get('token') || '';
    const isNewEmail = searchParams.get('isNewEmail') === 'true';

    (async () => {
      try {
        const response = await confirmEmail(token, isNewEmail);

        setMessage(response.message ?? 'Your email has been verified');
      } catch (error) {
        setError(typeof error === 'string' ? error : (error as ErrorResponse).message);
      }
    })();
  }, [searchParams, confirmEmail]);

  const hasLoaded = message || error;

  return (
    <ErrorBoundary>
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-screen-sm shadow-xl">
          <CardHeader className="text-center">
            <img src="/assets/logo.png" alt="MoaiTime Logo" className="m-auto mb-4 h-20 w-20" />
            <CardTitle>Confirm Email</CardTitle>
            <CardDescription>
              We just want to make sure that you are the owner of this email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {!hasLoaded && (
              <div className="text-center">
                <div className="inline-block">
                  <LoaderIcon className="animate-spin text-5xl" />
                </div>
              </div>
            )}
            {hasLoaded && (
              <Alert variant={error ? 'destructive' : 'default'}>
                <AlertDescription>
                  {message ?? error ?? 'Something went wrong while trying to verify your email'}
                </AlertDescription>
              </Alert>
            )}
            <Button
              variant="default"
              onClick={() => {
                navigate('/');
              }}
              className="mt-6 w-full"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
