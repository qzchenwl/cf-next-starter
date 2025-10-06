"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SubmissionState = "idle" | "pending" | "success" | "error";

const defaultMessage =
  "Send a test email to confirm the send_email binding is configured.";

export function EmailStatusCard() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState<string>(defaultMessage);

  const isPending = state === "pending";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      setState("error");
      setMessage("Please enter an email address.");
      return;
    }

    setState("pending");
    setMessage("Sending test email...");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      let payload: { ok?: boolean; message?: string; error?: string } | null =
        null;

      if (response.headers.get("content-type")?.includes("application/json")) {
        payload = await response.json();
      }

      if (!response.ok || !payload?.ok) {
        const errorMessage =
          payload?.error ??
          "We could not send the test email. Please verify the address is approved.";
        setState("error");
        setMessage(errorMessage);
        return;
      }

      setState("success");
      setMessage(
        payload.message ?? "Test email sent! Check your inbox shortly.",
      );
      setEmail("");
    } catch (error) {
      console.error("Failed to call send email endpoint", error);
      setState("error");
      setMessage(
        "A network error occurred. Retry once you are connected to the Worker.",
      );
    }
  };

  let statusLabel = "Idle";
  let statusVariant: BadgeProps["variant"] = "outline";

  if (state === "pending") {
    statusLabel = "Sending";
    statusVariant = "secondary";
  } else if (state === "success") {
    statusLabel = "Sent";
    statusVariant = "default";
  } else if (state === "error") {
    statusLabel = "Error";
    statusVariant = "destructive";
  }

  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
              <Send className="h-5 w-5" />
            </span>
            <CardTitle>Send Email</CardTitle>
          </div>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
        </div>
        <CardDescription
          className={cn(
            "text-sm leading-relaxed",
            state === "error" ? "text-destructive" : undefined,
          )}
        >
          {message}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <label className="sr-only" htmlFor="test-email-address">
                Destination email address
              </label>
              <input
                id="test-email-address"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isPending}
                placeholder="you@example.com"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <Button className="sm:w-auto" disabled={isPending} type="submit">
              {isPending ? "Sending..." : "Send test email"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
