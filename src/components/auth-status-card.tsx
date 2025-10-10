'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { Check, Clock, User, XCircle } from 'lucide-react';

import { authClient } from '@/lib/auth-client'; // ← Better Auth 客户端
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function AuthStatusCard() {
  const [status, setStatus] = useState<'checking' | 'logged-in' | 'logged-out'>('checking');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    tone: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<'sign-in' | 'sign-up' | 'google' | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState<boolean | null>(null);
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');

  // Initial session state
  useEffect(() => {
    const loadSession = async () => {
      setStatus('checking');
      const { data: session } = await authClient.getSession();
      if (session?.user) {
        setUserEmail(session.user.email);
        setEmailInput(session.user.email ?? '');
        setPasswordInput('');
        setIsEmailVerified(Boolean(session.user.emailVerified));
        setStatus('logged-in');
      } else {
        setUserEmail(null);
        setEmailInput('');
        setPasswordInput('');
        setIsEmailVerified(null);
        setStatus('logged-out');
      }
    };
    void loadSession();
  }, []);

  const ensureCredentials = (currentMode: 'sign-in' | 'sign-up') => {
    const normalizedEmail = emailInput.trim();
    const password = passwordInput;

    if (!normalizedEmail || !password) {
      setFeedback({ tone: 'error', message: 'Please provide both email and password.' });
      return null;
    }

    const emailPattern = /.+@.+\..+/;
    if (!emailPattern.test(normalizedEmail)) {
      setFeedback({ tone: 'error', message: 'Please enter a valid email address.' });
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
      setMode('sign-in');
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
    setStatus('logged-out');
    setIsEmailVerified(null);
    setFeedback(null);
    setIsLoading(false);
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

  const submitLabel = mode === 'sign-in' ? 'Sign in' : 'Create account';
  const submitLoadingLabel =
    mode === 'sign-in' ? 'Signing in…' : activeAction === 'sign-up' ? 'Creating account…' : 'Working…';

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

        {status === 'logged-out' ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 rounded-full border border-input bg-muted/40 p-1 text-xs font-medium">
              {(
                [
                  { value: 'sign-in' as const, label: 'Sign in' },
                  { value: 'sign-up' as const, label: 'Create account' },
                ] as const
              ).map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setMode(item.value);
                    setFeedback(null);
                    if (item.value === 'sign-up') {
                      setPasswordInput('');
                    }
                  }}
                  className={cn(
                    'flex-1 rounded-full px-3 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                    mode === item.value
                      ? 'bg-background text-foreground shadow'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <Button variant="outline" onClick={handleGoogleSignIn} disabled={isLoading} className="w-full">
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
                  if (mode === 'sign-in') {
                    void handleLogin();
                  } else {
                    void handleRegister();
                  }
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
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium" htmlFor="auth-password">
                      Password
                    </label>
                    {mode === 'sign-up' ? (
                      <span className="text-xs text-muted-foreground">Minimum 8 characters</span>
                    ) : null}
                  </div>
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
                    autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                    required
                  />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && activeAction !== 'google' ? submitLoadingLabel : submitLabel}
                </Button>
              </form>
            </div>

            <p className="text-xs text-muted-foreground">
              We will only use your email for account access. You can delete your account at any time from your profile
              settings.
            </p>
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        {status === 'logged-in' ? (
          <Button onClick={handleLogout} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? 'Signing out…' : 'Sign out'}
          </Button>
        ) : (
          <p className="text-xs text-muted-foreground">
            Having trouble?{' '}
            <button
              className="underline"
              type="button"
              onClick={() =>
                setFeedback({
                  tone: 'info',
                  message: 'Contact support@better-auth.dev and we will help reset your access.',
                })
              }
            >
              Contact support
            </button>
            .
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
