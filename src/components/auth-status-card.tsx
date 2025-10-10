'use client';

import { useState, useEffect } from 'react';
import { Loader2, MailCheck, User } from 'lucide-react';
import { authClient } from '@/lib/auth-client'; // ← Better Auth 客户端
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AuthStatusCard() {
  const [status, setStatus] = useState<'checking' | 'logged-in' | 'logged-out'>('checking');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<'login' | 'register' | 'google' | 'logout' | null>(null);
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
        setMode('sign-in');
      } else {
        setUserEmail(null);
        setEmailInput('');
        setPasswordInput('');
        setIsEmailVerified(null);
        setStatus('logged-out');
        setMode('sign-in');
      }
    };
    void loadSession();
  }, []);

  const ensureCredentials = () => {
    const normalizedEmail = emailInput.trim();
    const password = passwordInput;

    if (!normalizedEmail || !password) {
      setError('Please provide both email and password.');
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

  const handleEmailAuth = (intent: 'login' | 'register') => async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const credentials = ensureCredentials();
    if (!credentials) {
      return;
    }

    setIsLoading(true);
    setActiveAction(intent);
    setError(null);
    setInfo(null);
    setEmailInput(credentials.email);
    try {
      if (intent === 'login') {
        const { error } = await authClient.signIn.email({
          email: credentials.email,
          password: credentials.password,
        });
        if (error) {
          setError(error.message ?? 'Unknown error');
          return;
        }
        await refreshSession(credentials.email);
        setPasswordInput('');
        setInfo('Signed in successfully.');
      } else {
        const { error } = await authClient.signUp.email({
          name: credentials.email.split('@')[0],
          email: credentials.email,
          password: credentials.password,
        });
        if (error) {
          setError(error.message ?? 'Unknown error');
          return;
        }
        await refreshSession(credentials.email);
        setPasswordInput('');
        setInfo('Account created successfully. Please verify your email.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setActiveAction('google');
    setError(null);
    setInfo(null);
    try {
      const { error } = await authClient.signIn.social({
        provider: 'google',
      });
      if (error) {
        setError(error.message ?? 'Unknown error');
      } else {
        setInfo('Redirecting to Google for authentication...');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    setActiveAction('logout');
    await authClient.signOut();
    setUserEmail(null);
    setEmailInput('');
    setPasswordInput('');
    setStatus('logged-out');
    setIsEmailVerified(null);
    setInfo(null);
    setMode('sign-in');
    setIsLoading(false);
    setActiveAction(null);
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

  const emailForm = (intent: 'login' | 'register') => (
    <form className="space-y-4" onSubmit={handleEmailAuth(intent)}>
      <div className="space-y-2">
        <Label htmlFor={`auth-email-${intent}`}>Email</Label>
        <Input
          id={`auth-email-${intent}`}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={emailInput}
          onChange={(event) => {
            setEmailInput(event.target.value);
            if (error) {
              setError(null);
            }
            if (info) {
              setInfo(null);
            }
          }}
          disabled={isLoading}
          aria-invalid={Boolean(error)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`auth-password-${intent}`}>Password</Label>
        <Input
          id={`auth-password-${intent}`}
          type="password"
          autoComplete={intent === 'login' ? 'current-password' : 'new-password'}
          placeholder={intent === 'login' ? 'Enter your password' : 'Create a secure password'}
          value={passwordInput}
          onChange={(event) => {
            setPasswordInput(event.target.value);
            if (error) {
              setError(null);
            }
            if (info) {
              setInfo(null);
            }
          }}
          disabled={isLoading}
          aria-invalid={Boolean(error)}
        />
      </div>
      <Button className="w-full" disabled={isLoading} type="submit">
        {isLoading && activeAction === intent
          ? intent === 'login'
            ? 'Signing in...'
            : 'Creating account...'
          : intent === 'login'
            ? 'Continue with email'
            : 'Create account'}
      </Button>
    </form>
  );

  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <User className="h-5 w-5" />
            </span>
            <div className="space-y-1">
              <CardTitle>Better Auth</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
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
        {verificationMessage ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            {isEmailVerified ? <MailCheck className="h-4 w-4" /> : null}
            {verificationMessage}
          </p>
        ) : null}
      </CardHeader>

      <CardContent className="space-y-6">
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Authentication error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        {info ? (
          <Alert>
            <AlertTitle>All set</AlertTitle>
            <AlertDescription>{info}</AlertDescription>
          </Alert>
        ) : null}

        {status === 'checking' ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Checking your session…
          </div>
        ) : null}

        {status === 'logged-in' ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-border/80 bg-muted/30 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{userEmail}</span>
                {isEmailVerified ? (
                  <Badge
                    className="border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-200"
                    variant="outline"
                  >
                    Verified
                  </Badge>
                ) : (
                  <Badge
                    className="border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-400/40 dark:bg-amber-500/10 dark:text-amber-200"
                    variant="outline"
                  >
                    Verification pending
                  </Badge>
                )}
              </div>
              <p className="mt-2 text-muted-foreground">Use the button below to sign out or switch accounts.</p>
            </div>
          </div>
        ) : null}

        {status === 'logged-out' ? (
          <div className="space-y-6">
            <Tabs value={mode} onValueChange={(next) => setMode(next as 'sign-in' | 'sign-up')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sign-in">Sign in</TabsTrigger>
                <TabsTrigger value="sign-up">Create account</TabsTrigger>
              </TabsList>
              <TabsContent value="sign-in">{emailForm('login')}</TabsContent>
              <TabsContent value="sign-up">{emailForm('register')}</TabsContent>
            </Tabs>
            <div className="space-y-2 text-center text-xs text-muted-foreground">
              <p>Use a Google account instead:</p>
              <Button
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isLoading || status === 'checking'}
                className="w-full"
              >
                {isLoading && activeAction === 'google' ? 'Redirecting…' : 'Continue with Google'}
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>

      {status === 'logged-in' ? (
        <CardFooter className="border-t border-border bg-muted/20 pt-6">
          <Button onClick={handleLogout} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading && activeAction === 'logout' ? 'Signing out…' : 'Sign out'}
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}
