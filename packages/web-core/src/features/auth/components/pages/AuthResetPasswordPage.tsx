import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
} from '@moaitime/web-ui';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { useAuthStore } from '../../state/authStore';

export default function AuthResetPasswordPage() {
  const { resetPassword } = useAuthStore();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const onLoginButtonClick = () => {
    navigate('/login');
  };

  const onResetPasswordButtonClick = async () => {
    const token = searchParams.get('token') || '';

    try {
      const response = await resetPassword(token, password);

      toast({
        title: 'Success!',
        description: response.message ?? 'You have successfully reset your password!',
      });

      navigate('/login');
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-screen-sm">
          <CardHeader className="text-center">
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>There we go! What shall be our new password?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="resetPassword-password">Password</Label>
                <Input
                  type="password"
                  id="resetPassword-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />
              </div>
              <Button
                id="resetPassword-button"
                size="lg"
                variant="default"
                className="w-full"
                onClick={onResetPasswordButtonClick}
              >
                Reset Password
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
