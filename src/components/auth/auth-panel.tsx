"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SessionResponse = {
  session: {
    expiresAt: string;
    token: string;
  };
  user: {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
} | null;

const inputClasses =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function AuthPanel() {
  const [session, setSession] = useState<SessionResponse>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [signUpBusy, setSignUpBusy] = useState(false);
  const [signUpMessage, setSignUpMessage] = useState<string | null>(null);
  const [signUpError, setSignUpError] = useState<string | null>(null);

  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });
  const [signInBusy, setSignInBusy] = useState(false);
  const [signInMessage, setSignInMessage] = useState<string | null>(null);
  const [signInError, setSignInError] = useState<string | null>(null);

  const loadSession = useCallback(async () => {
    setSessionLoading(true);
    try {
      const response = await fetch("/api/auth/get-session", {
        credentials: "include",
      });
      if (!response.ok) {
        setSession(null);
        return;
      }
      const data = (await response.json()) as SessionResponse;
      setSession(data);
    } catch (error) {
      console.error("[auth] Failed to load session", error);
      setSession(null);
    } finally {
      setSessionLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession().catch(() => {
      setSession(null);
      setSessionLoading(false);
    });
  }, [loadSession]);

  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSignUpBusy(true);
    setSignUpError(null);
    setSignUpMessage(null);
    try {
      const response = await fetch("/api/auth/sign-up/email", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...signUpForm,
          callbackURL: "/auth/verify-email",
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const message = (payload && (payload.message || payload.error)) || "注册失败，请稍后再试";
        setSignUpError(message);
        return;
      }
      setSignUpMessage("注册成功，请检查邮箱完成验证。");
      setSignUpForm((prev) => ({ ...prev, password: "" }));
    } catch (error) {
      console.error("[auth] Sign up failed", error);
      setSignUpError("网络异常，请稍后再试。");
    } finally {
      setSignUpBusy(false);
    }
  }

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSignInBusy(true);
    setSignInError(null);
    setSignInMessage(null);
    try {
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...signInForm, rememberMe: true }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const message =
          (payload && (payload.message || payload.error)) || "登录失败，请检查账号与密码。";
        setSignInError(message);
        return;
      }
      setSignInMessage("登录成功！");
      setSignInForm((prev) => ({ ...prev, password: "" }));
      await loadSession();
    } catch (error) {
      console.error("[auth] Sign in failed", error);
      setSignInError("网络异常，请稍后重试。");
    } finally {
      setSignInBusy(false);
    }
  }

  async function handleSignOut() {
    try {
      const response = await fetch("/api/auth/sign-out", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        console.error("[auth] Sign out failed", payload);
      }
    } finally {
      await loadSession();
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>注册新账号</CardTitle>
          <CardDescription>使用用户名和密码创建账号，我们会发送验证邮件确保安全。</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={handleSignUp}>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground" htmlFor="sign-up-name">
                用户名
              </label>
              <input
                id="sign-up-name"
                className={inputClasses}
                name="name"
                autoComplete="name"
                required
                value={signUpForm.name}
                onChange={(event) =>
                  setSignUpForm((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground" htmlFor="sign-up-email">
                邮箱
              </label>
              <input
                id="sign-up-email"
                className={inputClasses}
                name="email"
                type="email"
                autoComplete="email"
                required
                value={signUpForm.email}
                onChange={(event) =>
                  setSignUpForm((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground" htmlFor="sign-up-password">
                密码
              </label>
              <input
                id="sign-up-password"
                className={inputClasses}
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={signUpForm.password}
                onChange={(event) =>
                  setSignUpForm((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
              />
            </div>
            {signUpError ? <p className="text-sm text-destructive">{signUpError}</p> : null}
            {signUpMessage ? (
              <p className="text-sm text-muted-foreground">{signUpMessage}</p>
            ) : null}
            <button
              className={cn(buttonVariants({ size: "lg" }), "w-full justify-center")}
              disabled={signUpBusy}
              type="submit"
            >
              {signUpBusy ? "提交中..." : "注册并发送验证邮件"}
            </button>
          </form>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>邮箱密码登录</CardTitle>
          <CardDescription>验证邮箱后即可登录，登录成功后可随时在此查看当前会话。</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={handleSignIn}>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground" htmlFor="sign-in-email">
                邮箱
              </label>
              <input
                id="sign-in-email"
                className={inputClasses}
                name="email"
                type="email"
                autoComplete="email"
                required
                value={signInForm.email}
                onChange={(event) =>
                  setSignInForm((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground" htmlFor="sign-in-password">
                密码
              </label>
              <input
                id="sign-in-password"
                className={inputClasses}
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={signInForm.password}
                onChange={(event) =>
                  setSignInForm((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
              />
            </div>
            {signInError ? <p className="text-sm text-destructive">{signInError}</p> : null}
            {signInMessage ? (
              <p className="text-sm text-muted-foreground">{signInMessage}</p>
            ) : null}
            <button
              className={cn(buttonVariants({ size: "lg" }), "w-full justify-center")}
              disabled={signInBusy}
              type="submit"
            >
              {signInBusy ? "登录中..." : "登录"}
            </button>
          </form>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>当前登录状态</CardTitle>
          <CardDescription>
            {sessionLoading ? "正在获取会话信息..." : session ? "已登录" : "未登录"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {session ? (
            <>
              <div>
                <p className="font-medium text-foreground">{session.user.name}</p>
                <p className="text-muted-foreground">{session.user.email}</p>
              </div>
              <div className="rounded-md border border-border bg-muted/30 p-3">
                <p>
                  邮箱状态：
                  <span
                    className={session.user.emailVerified ? "text-emerald-600" : "text-amber-600"}
                  >
                    {session.user.emailVerified ? "已验证" : "待验证"}
                  </span>
                </p>
                <p>会话过期时间：{new Date(session.session.expiresAt).toLocaleString()}</p>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">完成登录后会在此显示会话与邮箱验证状态。</p>
          )}
        </CardContent>
        <CardFooter className="justify-between">
          <button
            className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center")}
            disabled={!session}
            onClick={handleSignOut}
            type="button"
          >
            退出登录
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
