'use client';

import { useState, useEffect, type ReactNode, type SVGProps } from 'react';
import { Check, Clock, User, XCircle } from 'lucide-react';

import { authClient } from '@/lib/auth-client'; // ← Better Auth 客户端
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false" {...props}>
      <path
        d="M23.49 12.27c0-.84-.07-1.45-.22-2.09H12v3.79h6.54c-.13.94-.84 2.35-2.42 3.3l-.02.12 3.51 2.72.24.02c2.19-2.02 3.64-5 3.64-9.86"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.96-1.07 7.94-2.92l-3.78-2.92c-1.01.64-2.37 1.09-4.16 1.09-3.18 0-5.88-2.02-6.84-4.82l-.14.01-3.7 2.86-.05.13C2.32 21.78 6.83 24 12 24"
        fill="#34A853"
      />
      <path
        d="M5.16 14.43c-.25-.74-.4-1.53-.4-2.43s.15-1.7.39-2.43l-.01-.16-3.74-2.9-.12.06C.45 8.23 0 10.05 0 12c0 1.95.45 3.77 1.28 5.42"
        fill="#FBBC05"
      />
      <path
        d="M12 4.74c2.25 0 3.77.97 4.64 1.79l3.39-3.32C17.94 1.29 15.24 0 12 0 6.83 0 2.32 2.22 1.28 6.58l3.87 3.01C5.97 6.76 8.67 4.74 12 4.74"
        fill="#EA4335"
      />
    </svg>
  );
}

export function AuthStatusCard() {
  const [status, setStatus] = useState<'checking' | 'logged-in' | 'logged-out'>('checking');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    tone: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<'sign-in' | 'sign-up' | 'google' | 'otp-send' | 'otp-verify' | null>(
    null,
  );
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [authMode, setAuthMode] = useState<'credentials' | 'otp'>('credentials');
  const [isEmailVerified, setIsEmailVerified] = useState<boolean | null>(null);

  // Initial session state
  useEffect(() => {
    const loadSession = async () => {
      setStatus('checking');
      const { data: session } = await authClient.getSession();
      if (session?.user) {
        setUserEmail(session.user.email);
        setEmailInput(session.user.email ?? '');
        setPasswordInput('');
        setOtpInput('');
        setAuthMode('credentials');
        setIsEmailVerified(Boolean(session.user.emailVerified));
        setStatus('logged-in');
      } else {
        setUserEmail(null);
        setEmailInput('');
        setPasswordInput('');
        setOtpInput('');
        setAuthMode('credentials');
        setIsEmailVerified(null);
        setStatus('logged-out');
      }
    };
    void loadSession();
  }, []);

  const emailPattern = /.+@.+\..+/;

  const ensureEmail = () => {
    const normalizedEmail = emailInput.trim();

    if (!normalizedEmail) {
      setFeedback({ tone: 'error', message: 'Please provide your email address.' });
      return null;
    }

    if (!emailPattern.test(normalizedEmail)) {
      setFeedback({ tone: 'error', message: 'Please enter a valid email address.' });
      return null;
    }

    setEmailInput(normalizedEmail);
    return normalizedEmail;
  };

  const ensureCredentials = (currentMode: 'sign-in' | 'sign-up') => {
    const normalizedEmail = ensureEmail();
    const password = passwordInput;

    if (!normalizedEmail) {
      return null;
    }

    if (!password) {
      setFeedback({ tone: 'error', message: 'Please provide both email and password.' });
      return null;
    }

    if (currentMode === 'sign-up' && password.length < 8) {
      setFeedback({ tone: 'error', message: 'Use at least 8 characters for your password.' });
      return null;
    }

    return { email: normalizedEmail, password };
  };

  const refreshSession = async (fallbackEmail?: string) => {
    const { data: session } = await authClient.getSession();
    const nextEmail = session?.user?.email ?? null;
    setUserEmail(nextEmail);
    setEmailInput(nextEmail ?? fallbackEmail ?? '');
    setIsEmailVerified(session?.user ? Boolean(session.user.emailVerified) : null);
    setAuthMode('credentials');
    setOtpInput('');
    setStatus(session?.user ? 'logged-in' : 'logged-out');
  };

  const handleLogin = async () => {
    const credentials = ensureCredentials('sign-in');
    if (!credentials) {
      return;
    }

    setIsLoading(true);
    setActiveAction('sign-in');
    setFeedback(null);
    setEmailInput(credentials.email);
    try {
      const { error } = await authClient.signIn.email({
        email: credentials.email,
        password: credentials.password,
      });
      if (error) {
        setFeedback({ tone: 'error', message: error.message ?? 'Unknown error' });
        return;
      }
      await refreshSession(credentials.email);
      setPasswordInput('');
      setFeedback({ tone: 'success', message: 'Signed in successfully.' });
    } catch (err) {
      setFeedback({ tone: 'error', message: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  const handleRegister = async () => {
    const credentials = ensureCredentials('sign-up');
    if (!credentials) {
      return;
    }

    setIsLoading(true);
    setActiveAction('sign-up');
    setFeedback(null);
    setEmailInput(credentials.email);
    try {
      const { error } = await authClient.signUp.email({
        name: credentials.email.split('@')[0],
        email: credentials.email,
        password: credentials.password,
      });
      if (error) {
        setFeedback({ tone: 'error', message: error.message ?? 'Unknown error' });
        return;
      }

      await refreshSession(credentials.email);
      setPasswordInput('');
      setFeedback({ tone: 'success', message: 'Account created successfully. You can sign in right away.' });
    } catch (err) {
      setFeedback({ tone: 'error', message: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setActiveAction('google');
    setFeedback(null);
    try {
      const { error } = await authClient.signIn.social({
        provider: 'google',
      });
      if (error) {
        setFeedback({ tone: 'error', message: error.message ?? 'Unknown error' });
      } else {
        setFeedback({ tone: 'info', message: 'Redirecting to Google for authentication…' });
      }
    } catch (err) {
      setFeedback({ tone: 'error', message: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await authClient.signOut();
    setUserEmail(null);
    setEmailInput('');
    setPasswordInput('');
    setOtpInput('');
    setAuthMode('credentials');
    setStatus('logged-out');
    setIsEmailVerified(null);
    setFeedback(null);
    setIsLoading(false);
  };

  const handleSendOtp = async () => {
    const email = ensureEmail();
    if (!email) {
      return;
    }

    setIsLoading(true);
    setActiveAction('otp-send');
    setFeedback(null);
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: 'sign-in',
      });
      if (error) {
        setFeedback({ tone: 'error', message: error.message ?? 'Unable to send the login code.' });
        return;
      }

      setAuthMode('otp');
      setOtpInput('');
      setFeedback({
        tone: 'success',
        message: 'We emailed you a one-time code. Enter it below to finish signing in.',
      });
    } catch (err) {
      setFeedback({ tone: 'error', message: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  const handleOtpSignIn = async () => {
    const email = ensureEmail();
    const rawOtp = otpInput.trim();

    if (!email) {
      return;
    }

    if (!rawOtp) {
      setFeedback({ tone: 'error', message: 'Enter the code from your email to continue.' });
      return;
    }

    setIsLoading(true);
    setActiveAction('otp-verify');
    setFeedback(null);

    try {
      const { error } = await authClient.signIn.emailOtp({
        email,
        otp: rawOtp.replace(/\s+/g, ''),
      });
      if (error) {
        setFeedback({ tone: 'error', message: error.message ?? 'Unable to verify the code.' });
        return;
      }

      await refreshSession(email);
      setPasswordInput('');
      setOtpInput('');
      setAuthMode('credentials');
      setFeedback({ tone: 'success', message: 'Signed in with your one-time code.' });
    } catch (err) {
      setFeedback({ tone: 'error', message: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  let badgeVariant: BadgeProps['variant'];
  let badgeLabel;
  let description;
  let verificationMessage: string | null = null;

  const showVerification = status === 'logged-in' && isEmailVerified !== null;
  const verificationBadgeVariant: BadgeProps['variant'] = 'outline';
  const verificationBadgeClassName =
    isEmailVerified === true
      ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-200'
      : 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-400/40 dark:bg-amber-500/10 dark:text-amber-200';
  const verificationBadgeLabel = isEmailVerified === true ? 'Email verified' : 'Verification pending';

  if (status === 'checking') {
    badgeLabel = 'Checking';
    badgeVariant = 'secondary';
    description = 'Checking current login session...';
  } else if (status === 'logged-in') {
    badgeLabel = 'Logged in';
    badgeVariant = 'default';
    description = `Welcome back, ${userEmail}`;
    verificationMessage =
      isEmailVerified === true
        ? 'Your email address has been verified. All features are unlocked.'
        : 'We sent a verification email when you signed up. Please complete it to unlock all features.';
  } else {
    badgeLabel = 'Logged out';
    badgeVariant = 'outline';
    description = 'You are not logged in yet.';
    verificationMessage = null;
  }

  type FeedbackTone = NonNullable<typeof feedback>['tone'];

  const feedbackStyles: Record<FeedbackTone, string> = {
    success:
      'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-200',
    error:
      'border-destructive/50 bg-destructive/10 text-destructive dark:border-destructive/40 dark:bg-destructive/20 dark:text-destructive-foreground',
    info: 'border-primary/50 bg-primary/10 text-primary dark:border-primary/40 dark:bg-primary/15 dark:text-primary-foreground',
  };

  const feedbackIcon: Record<FeedbackTone, ReactNode> = {
    success: <Check className="h-4 w-4" aria-hidden />,
    error: <XCircle className="h-4 w-4" aria-hidden />,
    info: <Clock className="h-4 w-4" aria-hidden />,
  };

  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <User className="h-5 w-5" />
            </span>
            <CardTitle>Better Auth</CardTitle>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={badgeVariant}>{badgeLabel}</Badge>
            {showVerification ? (
              <Badge className={verificationBadgeClassName} variant={verificationBadgeVariant}>
                {verificationBadgeLabel}
              </Badge>
            ) : null}
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
        {verificationMessage ? <p className="text-sm text-muted-foreground">{verificationMessage}</p> : null}
      </CardHeader>

      {feedback ? (
        <CardContent>
          <div
            className={cn(
              'flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors',
              feedbackStyles[feedback.tone],
            )}
          >
            {feedbackIcon[feedback.tone]}
            <p>{feedback.message}</p>
          </div>
        </CardContent>
      ) : null}

      <CardContent className="space-y-6">
        {status === 'checking' ? (
          <div className="space-y-4">
            <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
            <div className="h-9 rounded-md bg-muted/60 animate-pulse" />
            <div className="h-9 rounded-md bg-muted/60 animate-pulse" />
          </div>
        ) : null}

        {status === 'logged-in' ? (
          <div className="space-y-4">
            <div className="rounded-md border border-muted bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground">
                You are signed in as <span className="font-medium text-foreground">{userEmail}</span>.
                {isEmailVerified === false
                  ? ' We have sent a verification email to help you unlock all features.'
                  : ' Your verification status looks good!'}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Need to switch accounts? Sign out below and sign back in with a different email address.
            </p>
          </div>
        ) : null}

        {status === 'logged-out' && authMode === 'credentials' ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <Button variant="outline" onClick={handleGoogleSignIn} disabled={isLoading} className="w-full">
                <GoogleIcon className="mr-2 h-4 w-4" />
                {isLoading && activeAction === 'google' ? 'Redirecting…' : 'Continue with Google'}
              </Button>

              <div className="relative">
                <span className="absolute inset-x-0 top-0 mx-auto -mt-3 w-fit bg-background px-2 text-xs uppercase text-muted-foreground">
                  or with email
                </span>
                <div className="h-px bg-border" />
              </div>

              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleLogin();
                }}
              >
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium" htmlFor="auth-email">
                    Email
                  </label>
                  <input
                    id="auth-email"
                    type="email"
                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                    placeholder="you@example.com"
                    value={emailInput}
                    onChange={(event) => {
                      setEmailInput(event.target.value);
                      if (feedback) {
                        setFeedback(null);
                      }
                    }}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium" htmlFor="auth-password">
                    Password
                  </label>
                  <input
                    id="auth-password"
                    type="password"
                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                    placeholder="Enter a secure password"
                    value={passwordInput}
                    onChange={(event) => {
                      setPasswordInput(event.target.value);
                      if (feedback) {
                        setFeedback(null);
                      }
                    }}
                    autoComplete="current-password"
                    required
                  />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && activeAction === 'sign-in' ? 'Signing in…' : 'Sign in'}
                </Button>

                <Button
                  type="button"
                  disabled={isLoading}
                  className="w-full"
                  onClick={() => {
                    void handleSendOtp();
                  }}
                >
                  {isLoading && activeAction === 'otp-send' ? '发送中…' : '发送验证码'}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  disabled={isLoading}
                  className="w-full"
                  onClick={() => {
                    void handleRegister();
                  }}
                >
                  {isLoading && activeAction === 'sign-up' ? 'Creating account…' : 'Create account'}
                </Button>
              </form>
            </div>
          </div>
        ) : null}

        {status === 'logged-out' && authMode === 'otp' ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter the one-time code we emailed to <span className="font-medium text-foreground">{emailInput}</span>.
            </p>

            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void handleOtpSignIn();
              }}
            >
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="auth-otp">
                  One-time code
                </label>
                <input
                  id="auth-otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                  placeholder="Enter the 6-digit code"
                  value={otpInput}
                  onChange={(event) => {
                    setOtpInput(event.target.value);
                    if (feedback?.tone === 'error') {
                      setFeedback(null);
                    }
                  }}
                  autoComplete="one-time-code"
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && activeAction === 'otp-verify' ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        {status === 'logged-in' && (
          <Button onClick={handleLogout} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? 'Signing out…' : 'Sign out'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
