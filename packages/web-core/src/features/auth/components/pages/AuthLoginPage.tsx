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
} from '@myzenbuddy/web-ui';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { useAuthStore } from '../../state/authStore';

export default function AuthLoginPage() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onForgotPasswordButtonClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    navigate('/forgot-password');
  };

  const onRegisterButtonClick = () => {
    navigate('/register');
  };

  const onLoginButtonClick = async () => {
    try {
      await login(email, password);
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-screen-sm">
          <CardHeader className="text-center">
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Do you want to experience something magical? If so, you are on the right place!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-8">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  type="email"
                  id="login-email"
                  autoFocus
                  tabIndex={1}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <div className="flex items-end justify-between">
                  <Label htmlFor="login-password">Password</Label>
                  <a
                    href="/forgot-password"
                    onClick={onForgotPasswordButtonClick}
                    className="text-xs font-bold"
                  >
                    Forgot Password?
                  </a>
                </div>
                <Input
                  type="password"
                  id="login-password"
                  tabIndex={2}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />
              </div>
              <Button
                id="login-button"
                size="lg"
                variant="default"
                tabIndex={3}
                className="w-full"
                onClick={onLoginButtonClick}
              >
                Login
              </Button>
            </div>
            <hr className="my-8" />
            <Button size="lg" variant="outline" className="w-full" onClick={onRegisterButtonClick}>
              Register
            </Button>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
