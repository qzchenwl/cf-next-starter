import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

export const runtime = "edge";

const EMAIL_SUBJECT = "Cloudflare email routing test";

function isValidEmail(value: string) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(value);
}

type SendEmailResponse =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      error: string;
    };

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch (error) {
    console.error("Invalid JSON payload for send email", error);
    const response: SendEmailResponse = {
      ok: false,
      error: "Invalid JSON body",
    };

    return NextResponse.json(response, { status: 400 });
  }

  const email =
    typeof (payload as { email?: string }).email === "string"
      ? (payload as { email?: string }).email.trim()
      : "";

  if (!isValidEmail(email)) {
    const response: SendEmailResponse = {
      ok: false,
      error: "Please provide a valid email address.",
    };

    return NextResponse.json(response, { status: 400 });
  }

  const { env } = await getCloudflareContext({ async: true });

  const fromAddress = env.SEND_EMAIL_FROM_ADDRESS?.trim();
  if (!fromAddress) {
    console.error("SEND_EMAIL_FROM_ADDRESS is not configured.");
    const response: SendEmailResponse = {
      ok: false,
      error:
        "The send email binding is missing a configured sender address.",
    };

    return NextResponse.json(response, { status: 500 });
  }

  const fromName = env.SEND_EMAIL_FROM_NAME?.trim();
  const displayFrom = fromName ? `${fromName} <${fromAddress}>` : fromAddress;
  const timestamp = new Date().toUTCString();

  const bodyLines = [
    "Hello!",
    "",
    "You just triggered a test email from the Cloudflare + Next.js starter.",
    "If you received this message, your send_email binding is ready to use.",
    "",
    `Sent at: ${timestamp}`,
  ];

  const rawMessage =
    [
      `From: ${displayFrom}`,
      `To: <${email}>`,
      `Subject: ${EMAIL_SUBJECT}`,
      `Date: ${timestamp}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: 7bit",
      "",
      bodyLines.join("\n"),
    ].join("\r\n");

  const { EmailMessage } = (await import("cloudflare:email")) as typeof import("cloudflare:email");
  const message = new EmailMessage(fromAddress, email, rawMessage);

  try {
    await env.SEND_EMAIL.send(message);
  } catch (error) {
    console.error("Failed to dispatch email", error);
    const response: SendEmailResponse = {
      ok: false,
      error: "Cloudflare was unable to send the email. Check the Worker logs.",
    };

    return NextResponse.json(response, { status: 502 });
  }

  const response: SendEmailResponse = {
    ok: true,
    message: "Test email sent! Check the inbox of the destination address.",
  };

  return NextResponse.json(response, { status: 200 });
}
