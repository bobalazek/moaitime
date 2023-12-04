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
  useToast,
} from '@myzenbuddy/web-ui';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { useAuthStore } from '../../state/authStore';

export default function AuthForgotPasswordPage() {
  const { requestPasswordReset } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const onLoginButtonClick = () => {
    navigate('/login');
  };

  const onRequestPasswordResetButtonClick = async () => {
    try {
      await requestPasswordReset(email);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description:
          error instanceof Error ? error.message : 'Something went wrong while trying to request password reset',
      });
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-screen-sm">
          <CardHeader className="text-center">
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>Oh dear, memory isn't the same as it used to be, uh?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-6">
              <div className="flex flex-col space-y-2">
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
