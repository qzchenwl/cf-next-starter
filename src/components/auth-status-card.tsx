"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { authClient } from "@/lib/auth-client"; // ← Better Auth 客户端
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/ui/card";

export function AuthStatusCard() {
  const [status, setStatus] = useState<"checking" | "logged-in" | "logged-out">("checking");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initial session state
  useEffect(() => {
    const loadSession = async () => {
      setStatus("checking");
      const { data: session } = await authClient.getSession();
      if (session?.user) {
        setUserEmail(session.user.email);
        setStatus("logged-in");
      } else {
        setUserEmail(null);
        setStatus("logged-out");
      }
    };
    void loadSession();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await authClient.signIn.email({
        email: "test@example.com",
        password: "password",
      });
      if (error) {
        setError(error.message ?? "Unknown error");
        return;
      }
      const { data: session } = await authClient.getSession();
      setUserEmail(session?.user.email ?? null);
      setStatus(session ? "logged-in" : "logged-out");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await authClient.signOut();
    setUserEmail(null);
    setStatus("logged-out");
    setIsLoading(false);
  };

  let badgeVariant: BadgeProps["variant"];
  let badgeLabel;
  let description;

  if (status === "checking") {
    badgeLabel = "Checking";
    badgeVariant = "secondary";
    description = "Checking current login session...";
  } else if (status === "logged-in") {
    badgeLabel = "Logged in";
    badgeVariant = "default";
    description = `Welcome back, ${userEmail}`;
  } else {
    badgeLabel = "Logged out";
    badgeVariant = "outline";
    description = "You are not logged in yet.";
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

      <CardFooter className="justify-end border-t border-border pt-6">
        {status === "logged-in" ? (
          <Button onClick={handleLogout} disabled={isLoading}>
            {isLoading ? "Signing out..." : "Sign out"}
          </Button>
        ) : (
          <Button onClick={handleLogin} disabled={isLoading}>
            {isLoading ? "Signing in..." : "Quick Sign in"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
