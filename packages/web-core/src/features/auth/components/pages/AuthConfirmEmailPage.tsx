import { useEffect, useRef, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
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
} from '@myzenbuddy/web-ui';

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
        <Card className="w-full max-w-screen-sm">
          <CardHeader className="text-center">
            <CardTitle>Confirm Email</CardTitle>
            <CardDescription>
              We just want to make sure that you are the owner of this email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {!hasLoaded && (
              <div className="text-center">
                <div className="inline-block">
                  <FaSpinner className="animate-spin text-5xl" />
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