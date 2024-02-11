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

export default function AuthRegisterPage() {
  const { register } = useAuthStore();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLoginButtonClick = () => {
    navigate('/login');
  };

  const onRegisterButtonClick = async () => {
    try {
      const response = await register(displayName, username, email, password);

      sonnerToast.success('Success!', {
        description: response.message ?? 'You have successfully registered!',
      });
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-screen-sm">
          <CardHeader className="text-center">
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Brilliant, let's get started, shall we?!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="register-displayName">Display Name</Label>
                <Input
                  id="register-displayName"
                  autoFocus
                  placeholder="Johnny"
                  value={displayName}
                  onChange={(event) => {
                    setDisplayName(event.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="register-username">Username</Label>
                <Input
                  id="register-username"
                  autoFocus
                  placeholder="johndoe"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  type="email"
                  id="register-email"
                  autoFocus
                  placeholder="johnny.doe@gmail.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  type="password"
                  id="register-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />
              </div>
              <Button
                id="register-button"
                size="lg"
                variant="default"
                className="w-full"
                onClick={onRegisterButtonClick}
              >
                Register
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
