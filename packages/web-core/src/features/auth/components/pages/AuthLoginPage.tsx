import { useGoogleLogin } from '@react-oauth/google';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { OauthProviderEnum } from '@moaitime/shared-common';
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
import { GoogleSvgIcon } from '../../../core/utils/Icons';
import { useAuthStore } from '../../state/authStore';

export default function AuthLoginPage() {
  const { login, oauthLogin } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const googleLogin = useGoogleLogin({
    onSuccess: async (token) => {
      try {
        await oauthLogin(OauthProviderEnum.GOOGLE, token);
      } catch (error) {
        // Already handled by the fetch function
      }
    },
    onError: (error) => {
      sonnerToast.error('Google login failed', {
        description: error.error_description,
      });
    },
  });

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
      // Already handled by the fetch function
    }
  };

  const onPaswordlessLoginButtonClick = async () => {
    navigate('/passwordless-login');
  };

  const onLoginGoogleButtonClick = async () => {
    googleLogin();
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen items-center justify-center p-4">
        <Card className="w-full max-w-screen-sm shadow-xl">
          <CardHeader className="text-center">
            <img src="/assets/logo.png" alt="MoaiTime Logo" className="m-auto mb-4 h-20 w-20" />
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Do you want to experience something magical? If so, you are on the right place!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
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
              <div className="flex flex-col gap-2">
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
                <div className="relative">
                  <Input
                    type={isPasswordVisible ? 'text' : 'password'}
                    id="login-password"
                    className="pr-10"
                    tabIndex={2}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                    onKeyPress={(event) => {
                      if (event.key === 'Enter') {
                        onLoginButtonClick();
                      }
                    }}
                  />
                  <button
                    className="text-muted-foreground absolute right-2 top-2"
                    onClick={() => {
                      setIsPasswordVisible(!isPasswordVisible);
                    }}
                  >
                    {isPasswordVisible ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
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
                <div className="text-muted-foreground text-center text-sm">or</div>
                <Button
                  id="passwordless-login-button"
                  size="lg"
                  variant="default"
                  tabIndex={3}
                  className="w-full"
                  onClick={onPaswordlessLoginButtonClick}
                >
                  Passwordless Login
                </Button>
                <div className="text-muted-foreground text-center text-sm">or</div>
                <Button
                  id="login-button"
                  size="lg"
                  variant="outline"
                  tabIndex={4}
                  className="flex w-full gap-2"
                  onClick={onLoginGoogleButtonClick}
                >
                  <GoogleSvgIcon />
                  Sign in with Google
                </Button>
              </div>
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
