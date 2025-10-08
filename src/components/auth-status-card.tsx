'use client';

import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { authClient } from '@/lib/auth-client'; // ← Better Auth 客户端
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from '@/components/ui/card';
import { useTranslations } from '@/components/translations-provider';

export function AuthStatusCard() {
  const [status, setStatus] = useState<'checking' | 'logged-in' | 'logged-out'>('checking');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<'missingCredentials' | 'unknown' | null>(null);
  const [infoKey, setInfoKey] = useState<'signedIn' | 'accountCreated' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<'login' | 'register' | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState<boolean | null>(null);
  const t = useTranslations('components.authStatusCard');

  // Initial session state
  useEffect(() => {
    const loadSession = async () => {
      setStatus('checking');
      setErrorMessage(null);
      setErrorKey(null);
      setInfoKey(null);
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

  const ensureCredentials = () => {
    const normalizedEmail = emailInput.trim();
    const password = passwordInput;

    if (!normalizedEmail || !password) {
      setErrorKey('missingCredentials');
      setErrorMessage(null);
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
    const credentials = ensureCredentials();
    if (!credentials) {
      return;
    }

    setIsLoading(true);
    setActiveAction('login');
    setErrorMessage(null);
    setErrorKey(null);
    setInfoKey(null);
    setEmailInput(credentials.email);
    try {
      const { error } = await authClient.signIn.email({
        email: credentials.email,
        password: credentials.password,
      });
      if (error) {
        if (error.message) {
          setErrorMessage(error.message);
          setErrorKey(null);
        } else {
          setErrorKey('unknown');
          setErrorMessage(null);
        }
        return;
      }
      await refreshSession(credentials.email);
      setPasswordInput('');
      setInfoKey('signedIn');
    } catch (err) {
      if (err instanceof Error && err.message) {
        setErrorMessage(err.message);
        setErrorKey(null);
      } else {
        setErrorKey('unknown');
        setErrorMessage(null);
      }
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
    setErrorMessage(null);
    setErrorKey(null);
    setInfoKey(null);
    setEmailInput(credentials.email);
    try {
      const { error } = await authClient.signUp.email({
        name: credentials.email.split('@')[0],
        email: credentials.email,
        password: credentials.password,
      });
      if (error) {
        if (error.message) {
          setErrorMessage(error.message);
          setErrorKey(null);
        } else {
          setErrorKey('unknown');
          setErrorMessage(null);
        }
        return;
      }

      await refreshSession(credentials.email);
      setPasswordInput('');
      setInfoKey('accountCreated');
    } catch (err) {
      if (err instanceof Error && err.message) {
        setErrorMessage(err.message);
        setErrorKey(null);
      } else {
        setErrorKey('unknown');
        setErrorMessage(null);
      }
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
    setInfoKey(null);
    setErrorMessage(null);
    setErrorKey(null);
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
  const verificationBadgeLabel =
    isEmailVerified === true ? t('verification.verified.label') : t('verification.pending.label');

  if (status === 'checking') {
    badgeLabel = t('statuses.checking.label');
    badgeVariant = 'secondary';
    description = t('statuses.checking.description');
  } else if (status === 'logged-in') {
    badgeLabel = t('statuses.loggedIn.label');
    badgeVariant = 'default';
    description = t('statuses.loggedIn.description', { email: userEmail ?? '' });
    verificationMessage =
      isEmailVerified === true ? t('verification.verified.message') : t('verification.pending.message');
  } else {
    badgeLabel = t('statuses.loggedOut.label');
    badgeVariant = 'outline';
    description = t('statuses.loggedOut.description');
    verificationMessage = null;
  }

  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <User className="h-5 w-5" />
            </span>
            <CardTitle>{t('title')}</CardTitle>
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

      {(errorKey || errorMessage) && (
        <CardContent>
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {errorKey ? t(`errors.${errorKey}`) : errorMessage}
          </div>
        </CardContent>
      )}

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="auth-email">
            {t('fields.emailLabel')}
          </label>
          <input
            id="auth-email"
            type="email"
            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder={t('fields.emailPlaceholder')}
            value={emailInput}
            onChange={(event) => {
              setEmailInput(event.target.value);
              if (errorMessage || errorKey) {
                setErrorMessage(null);
                setErrorKey(null);
              }
              if (infoKey) {
                setInfoKey(null);
              }
            }}
            autoComplete="email"
            disabled={isLoading || status !== 'logged-out'}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="auth-password">
            {t('fields.passwordLabel')}
          </label>
          <input
            id="auth-password"
            type="password"
            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder={t('fields.passwordPlaceholder')}
            value={passwordInput}
            onChange={(event) => {
              setPasswordInput(event.target.value);
              if (errorMessage || errorKey) {
                setErrorMessage(null);
                setErrorKey(null);
              }
              if (infoKey) {
                setInfoKey(null);
              }
            }}
            autoComplete={status === 'logged-in' ? 'off' : 'current-password'}
            disabled={isLoading || status !== 'logged-out'}
          />
        </div>
        {infoKey ? (
          <div className="rounded-md border border-muted bg-muted/20 p-3 text-sm text-muted-foreground">
            {t(`info.${infoKey}`)}
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="flex-wrap gap-3 border-t border-border pt-6">
        {status === 'logged-in' ? (
          <Button onClick={handleLogout} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? t('buttons.signOutLoading') : t('buttons.signOut')}
          </Button>
        ) : (
          <>
            <Button
              onClick={handleLogin}
              disabled={isLoading || status === 'checking'}
              className="w-full flex-1 sm:flex-none"
            >
              {isLoading && activeAction === 'login' ? t('buttons.signInLoading') : t('buttons.signIn')}
            </Button>
            <Button
              variant="secondary"
              onClick={handleRegister}
              disabled={isLoading || status === 'checking'}
              className="w-full flex-1 sm:flex-none"
            >
              {isLoading && activeAction === 'register'
                ? t('buttons.createAccountLoading')
                : t('buttons.createAccount')}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
