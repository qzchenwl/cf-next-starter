'use client';

import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { authClient } from '@/lib/auth-client'; // ← Better Auth 客户端
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from '@/components/ui/card';

export function AuthStatusCard() {
  const [status, setStatus] = useState<'checking' | 'logged-in' | 'logged-out'>('checking');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<'login' | 'register' | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Initial session state
  useEffect(() => {
    const loadSession = async () => {
      setStatus('checking');
      const { data: session } = await authClient.getSession();
      if (session?.user) {
        setUserEmail(session.user.email);
        setEmailInput(session.user.email ?? '');
        setPasswordInput('');
        setStatus('logged-in');
      } else {
        setUserEmail(null);
        setEmailInput('');
        setPasswordInput('');
        setStatus('logged-out');
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
    setStatus(session?.user ? 'logged-in' : 'logged-out');
  };

  const handleLogin = async () => {
    const credentials = ensureCredentials();
    if (!credentials) {
      return;
    }

    setIsLoading(true);
    setActiveAction('login');
    setError(null);
    setInfo(null);
    setEmailInput(credentials.email);
    try {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  const handleRegister = async () => {
    const credentials = ensureCredentials();
    if (!credentials) {
      return;
    }

    setIsLoading(true);
    setActiveAction('register');
    setError(null);
    setInfo(null);
    setEmailInput(credentials.email);
    try {
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
      setInfo('Account created successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
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
    setInfo(null);
    setIsLoading(false);
  };

  let badgeVariant: BadgeProps['variant'];
  let badgeLabel;
  let description;

  if (status === 'checking') {
    badgeLabel = 'Checking';
    badgeVariant = 'secondary';
    description = 'Checking current login session...';
  } else if (status === 'logged-in') {
    badgeLabel = 'Logged in';
    badgeVariant = 'default';
    description = `Welcome back, ${userEmail}`;
  } else {
    badgeLabel = 'Logged out';
    badgeVariant = 'outline';
    description = 'You are not logged in yet.';
  }

  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <User className="h-5 w-5" />
            </span>
            <CardTitle>Better Auth</CardTitle>
          </div>
          <Badge variant={badgeVariant}>{badgeLabel}</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      {error && (
        <CardContent>
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        </CardContent>
      )}

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="auth-email">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
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
            autoComplete="email"
            disabled={isLoading || status !== 'logged-out'}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="auth-password">
            Password
          </label>
          <input
            id="auth-password"
            type="password"
            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="Enter a secure password"
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
            autoComplete={status === 'logged-in' ? 'off' : 'current-password'}
            disabled={isLoading || status !== 'logged-out'}
          />
        </div>
        {info && (
          <div className="rounded-md border border-muted bg-muted/20 p-3 text-sm text-muted-foreground">{info}</div>
        )}
      </CardContent>

      <CardFooter className="flex-wrap gap-3 border-t border-border pt-6">
        {status === 'logged-in' ? (
          <Button onClick={handleLogout} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? 'Signing out...' : 'Sign out'}
          </Button>
        ) : (
          <>
            <Button
              onClick={handleLogin}
              disabled={isLoading || status === 'checking'}
              className="w-full flex-1 sm:flex-none"
            >
              {isLoading && activeAction === 'login' ? 'Signing in...' : 'Sign in'}
            </Button>
            <Button
              variant="secondary"
              onClick={handleRegister}
              disabled={isLoading || status === 'checking'}
              className="w-full flex-1 sm:flex-none"
            >
              {isLoading && activeAction === 'register' ? 'Creating account...' : 'Create account'}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
