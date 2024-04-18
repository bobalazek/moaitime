import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { UserPasswordlessLogin } from '@moaitime/shared-common';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  sonnerToast,
} from '@moaitime/web-ui';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { useAuthStore } from '../../state/authStore';

export default function AuthPasswordlessLoginPage() {
  const [searchParams] = useSearchParams();
  const { requestPasswordlessLogin, checkPasswordlessLogin, passwordlessLogin } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [passwordlessLoginData, setPasswordlessLoginData] = useState<UserPasswordlessLogin | null>(
    null
  );

  useEffect(() => {
    (async () => {
      const codeSearchParam = searchParams.get('code');
      const tokenSearchParam = searchParams.get('token');

      if (codeSearchParam) {
        setCode(codeSearchParam);
      }

      if (tokenSearchParam) {
        const response = await checkPasswordlessLogin(tokenSearchParam);
        setPasswordlessLoginData(response.data as UserPasswordlessLogin);
      }
    })();
  }, [searchParams, checkPasswordlessLogin]);

  const onConfirmButtonClick = async () => {
    try {
      if (passwordlessLoginData) {
        const response = await passwordlessLogin(passwordlessLoginData.token, code);

        sonnerToast.success('Success!', {
          description: response.message,
        });

        navigate('/');

        return;
      }

      const response = await requestPasswordlessLogin(email);

      sonnerToast.success('Success!', {
        description: response.message,
      });

      setPasswordlessLoginData(response.data as UserPasswordlessLogin);
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  const onBackToLoginButtonClick = () => {
    navigate('/login');
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen items-center justify-center p-4">
        <Card className="w-full max-w-screen-sm shadow-xl">
          <CardHeader className="text-center">
            <img src="/assets/logo.png" alt="MoaiTime Logo" className="m-auto mb-4 h-20 w-20" />
            <CardTitle>Passwordless Login</CardTitle>
            <CardDescription>
              Don't feel like typing your password? We got you covered. Enter your email and we'll
              send you a magic link to sign in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-8">
              {!passwordlessLoginData && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="passwordless-login-email">Email</Label>
                  <Input
                    id="passwordless-login-email"
                    autoFocus
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                  />
                </div>
              )}
              {passwordlessLoginData && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="passwordless-login-code">Code</Label>
                  <Input
                    id="passwordless-login-code"
                    autoFocus
                    value={code}
                    onChange={(event) => {
                      setCode(event.target.value);
                    }}
                  />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Button
                  id="passwordless-login-button"
                  size="lg"
                  variant="default"
                  tabIndex={3}
                  className="w-full"
                  onClick={onConfirmButtonClick}
                >
                  {!passwordlessLoginData ? 'Send Magic Link' : 'Confirm Code'}
                </Button>
              </div>
            </div>
            <hr className="my-8" />
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={onBackToLoginButtonClick}
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
