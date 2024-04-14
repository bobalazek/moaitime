import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

export default function AuthForgotPasswordPage() {
  const { requestPasswordReset } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const onLoginButtonClick = () => {
    navigate('/login');
  };

  const onRequestPasswordResetButtonClick = async () => {
    try {
      const response = await requestPasswordReset(email);

      sonnerToast.success('Success!', {
        description: response.message ?? 'You have successfully requested the password reset!',
      });
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-screen-sm shadow-xl">
          <CardHeader className="text-center">
            <img src="/assets/logo.png" alt="MoaiTime Logo" className="m-auto mb-4 h-20 w-20" />
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>Oh dear, memory isn't the same as it used to be, uh?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="forgotPassword-email">Email</Label>
                <Input
                  type="email"
                  id="forgotPassword-email"
                  autoFocus
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
              </div>

              <Button
                id="forgotPassword-button"
                size="lg"
                variant="default"
                className="w-full"
                onClick={onRequestPasswordResetButtonClick}
              >
                Request Password Reset
              </Button>
            </div>
            <hr className="my-8" />
            <Button size="lg" variant="outline" className="w-full" onClick={onLoginButtonClick}>
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
