/* eslint-disable @next/next/no-head-element */

import type { CSSProperties } from "react";

const DEFAULT_APP_NAME = "Cloudflare Next Starter";
const DEFAULT_PRIMARY_COLOR = "#2563eb";
const DEFAULT_TEXT_COLOR = "#0f172a";

export interface VerificationEmailProps {
  recipientName: string;
  verificationUrl: string;
  appName?: string;
  primaryColor?: string;
}

const bodyStyle: CSSProperties = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  lineHeight: 1.5,
  color: DEFAULT_TEXT_COLOR,
  margin: 0,
  padding: "32px 24px",
  backgroundColor: "#f8fafc",
};

const cardStyle: CSSProperties = {
  margin: "0 auto",
  maxWidth: 480,
  padding: "32px 28px",
  backgroundColor: "#ffffff",
  borderRadius: 12,
  boxShadow: "0 12px 35px rgba(15, 23, 42, 0.08)",
};

const buttonStyle: CSSProperties = {
  display: "inline-block",
  padding: "12px 20px",
  borderRadius: 8,
  fontWeight: 600,
  fontSize: 16,
  color: "#ffffff",
  textDecoration: "none",
};

const footerStyle: CSSProperties = {
  marginTop: 32,
  fontSize: 12,
  color: "#64748b",
};

export function VerificationEmail({
  recipientName,
  verificationUrl,
  appName = DEFAULT_APP_NAME,
  primaryColor = DEFAULT_PRIMARY_COLOR,
}: VerificationEmailProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{`Verify your email address | ${appName}`}</title>
      </head>
      <body style={bodyStyle}>
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              <td align="center">
                <div style={cardStyle}>
                  <p style={{ fontSize: 18, margin: "0 0 12px" }}>Hi {recipientName},</p>
                  <p style={{ margin: "0 0 16px" }}>
                    Thanks for signing up for <strong>{appName}</strong>. Please confirm your email
                    address to finish creating your account.
                  </p>
                  <p style={{ margin: "24px 0" }}>
                    <a
                      href={verificationUrl}
                      style={{ ...buttonStyle, backgroundColor: primaryColor }}
                    >
                      Verify email address
                    </a>
                  </p>
                  <p style={{ margin: "0 0 16px" }}>
                    If the button above does not work, copy and paste this link into your browser:
                  </p>
                  <p style={{ margin: "0 0 16px" }}>
                    <a href={verificationUrl} style={{ color: primaryColor }}>
                      {verificationUrl}
                    </a>
                  </p>
                  <p style={{ margin: 0 }}>
                    If you did not create this account you can safely ignore this email.
                  </p>
                  <p style={footerStyle}>Sent with ❤️ by {appName}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
