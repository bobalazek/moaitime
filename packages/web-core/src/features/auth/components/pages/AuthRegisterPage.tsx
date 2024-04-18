import { useGoogleLogin } from '@react-oauth/google';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { OauthProviderEnum, OauthToken, OauthUserInfo } from '@moaitime/shared-common';
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  sonnerToast,
} from '@moaitime/web-ui';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { GoogleSvgIcon } from '../../../core/utils/Icons';
import { useAuthStore } from '../../state/authStore';

export default function AuthRegisterPage() {
  const { register, oauthUserInfo } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [invitationToken, setInvitationToken] = useState<string>();
  const [teamUserInvitationToken, setTeamUserInvitationToken] = useState<string>();
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [oauthProvider, setOauthProvider] = useState<OauthProviderEnum>();
  const [oauthToken, setOauthToken] = useState<OauthToken>();
  const [oauthUserInfoData, setOauthUserInfo] = useState<OauthUserInfo>();
  const googleConnect = useGoogleLogin({
    onSuccess: async (token) => {
      try {
        setOauthProvider(OauthProviderEnum.GOOGLE);
        setOauthToken(token);

        const userInfo = await oauthUserInfo(OauthProviderEnum.GOOGLE, token);
        if (userInfo) {
          setOauthUserInfo(userInfo);
          setEmail(userInfo.email ?? '');
          setDisplayName(userInfo.firstName ?? '');
        }
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

  useEffect(() => {
    const invitationTokenParam = searchParams.get('invitationToken') ?? undefined;
    const teamUserInvitationTokenParam = searchParams.get('teamUserInvitationToken') ?? undefined;

    setInvitationToken(invitationTokenParam);
    setTeamUserInvitationToken(teamUserInvitationTokenParam);
  }, [searchParams]);

  const onBackToLoginButtonClick = () => {
    navigate('/login');
  };

  const onGoogleConnectButtonClick = async () => {
    googleConnect();
  };

  const onRegisterButtonClick = async () => {
    if (!terms) {
      sonnerToast.error('Error!', {
        description: 'You need to agree to the terms and conditions to register!',
      });
      return;
    }

    try {
      const response = await register({
        displayName,
        username,
        email,
        password: password ? password : undefined,
        invitationToken,
        teamUserInvitationToken,
        oauth:
          oauthProvider && oauthToken
            ? {
                provider: oauthProvider,
                token: oauthToken,
              }
            : undefined,
      });

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
        <Card className="w-full max-w-screen-sm shadow-xl">
          <CardHeader className="text-center">
            <img src="/assets/logo.png" alt="MoaiTime Logo" className="m-auto mb-4 h-20 w-20" />
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Brilliant, let's get started, shall we?!</CardDescription>
          </CardHeader>
          <CardContent>
            {!oauthToken && (
              <>
                <Button
                  id="login-button"
                  size="lg"
                  variant="outline"
                  tabIndex={3}
                  className="flex w-full gap-2"
                  onClick={onGoogleConnectButtonClick}
                >
                  <GoogleSvgIcon />
                  Connect with Google
                </Button>
                <div className="text-muted-foreground py-2 text-center text-sm">or</div>
              </>
            )}
            {oauthUserInfoData && (
              <Alert variant="success" className="mb-6">
                <AlertDescription>
                  <div className="flex flex-row items-center gap-4">
                    {oauthUserInfoData.avatarUrl && (
                      <div>
                        <img
                          src={oauthUserInfoData.avatarUrl}
                          alt="Profile"
                          className="h-16 w-16 rounded-full"
                        />
                      </div>
                    )}
                    <div>
                      Hello <b>{oauthUserInfoData.firstName}</b> (<b>{oauthUserInfoData.email}</b>)!
                      You are now connected with the OAuth provider! Please fill out all the
                      remaining fields below.
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col gap-6">
              {teamUserInvitationToken && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="register-teamUserInvitationToken">Team Invitation Token</Label>
                  <Input
                    id="register-teamUserInvitationToken"
                    autoFocus
                    value={teamUserInvitationToken}
                    onChange={(event) => {
                      setTeamUserInvitationToken(event.target.value);
                    }}
                  />
                </div>
              )}
              {!teamUserInvitationToken && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="register-invitationToken">Invitation Token</Label>
                  <Input
                    id="register-invitationToken"
                    autoFocus
                    value={invitationToken}
                    onChange={(event) => {
                      setInvitationToken(event.target.value);
                    }}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  />
                  <div className="text-muted-foreground text-sm">
                    For now, only users with an invitation token can register. If you don't have
                    one, do check our social accounts for giveaways!
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-2">
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
              <div className="flex flex-col gap-2">
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
              {!oauthUserInfoData && (
                <>
                  <div className="flex flex-col gap-2">
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
                      readOnly={oauthToken !== undefined}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
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
                </>
              )}
              <div className="flex flex-row items-center gap-2">
                <Checkbox
                  id="register-terms"
                  checked={terms}
                  onClick={() => {
                    setTerms(!terms);
                  }}
                />
                <Label htmlFor="register-terms" className="text-sm">
                  By signing up, you agree to our{' '}
                  <Link to="/terms" target="_blank" className="font-bold">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" target="_blank" className="font-bold">
                    Privacy Policy
                  </Link>
                  .
                </Label>
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
