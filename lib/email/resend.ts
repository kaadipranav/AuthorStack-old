import { Resend } from "resend";
import { env } from "@/lib/env";

export const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

const FROM_EMAIL = env.FROM_EMAIL || "onboarding@resend.dev";

type SendTransactionalInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendTransactionalEmail(input: SendTransactionalInput) {
  if (!resend || !env.FROM_EMAIL) {
    console.warn("[Resend] Not configured. Email not sent.");
    return { success: false, message: "Resend not configured" };
  }

  try {
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });

    console.log(`[Resend] ✓ Email sent to ${input.to}`);
    return { success: true, message: "Email sent", id: response.data?.id };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[Resend] Error sending email:", errorMessage);
    return { success: false, message: errorMessage };
  }
}

export async function sendSignupConfirmation(email: string, confirmationUrl: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
          .button { display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to AuthorStack</h1>
          </div>
          <div class="content">
            <p>Hi there,</p>
            <p>Thanks for signing up! Please confirm your email address to get started.</p>
            <a href="${confirmationUrl}" class="button">Confirm Email</a>
            <p>Or copy this link: <a href="${confirmationUrl}">${confirmationUrl}</a></p>
            <p>This link expires in 24 hours.</p>
          </div>
          <div class="footer">
            <p>© 2025 AuthorStack. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendTransactionalEmail({
    to: email,
    subject: "Confirm your AuthorStack email",
    html,
  });
}

export async function sendPasswordReset(email: string, resetUrl: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
          .button { display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset</h1>
          </div>
          <div class="content">
            <p>Hi,</p>
            <p>We received a request to reset your password. Click the button below to set a new password.</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
            <p>This link expires in 1 hour.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2025 AuthorStack. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendTransactionalEmail({
    to: email,
    subject: "Reset your AuthorStack password",
    html,
  });
}

export async function sendSubscriptionUpdated(
  email: string,
  tier: "free" | "pro" | "enterprise",
  planName: string
) {
  const tierDisplay = tier.charAt(0).toUpperCase() + tier.slice(1);
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
          .highlight { background: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 15px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Subscription Updated</h1>
          </div>
          <div class="content">
            <p>Hi,</p>
            <p>Your subscription has been updated!</p>
            <div class="highlight">
              <strong>Plan:</strong> ${planName}<br>
              <strong>Tier:</strong> ${tierDisplay}
            </div>
            <p>You now have access to all ${tierDisplay} features. Thank you for your support!</p>
          </div>
          <div class="footer">
            <p>© 2025 AuthorStack. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendTransactionalEmail({
    to: email,
    subject: `Your AuthorStack subscription updated to ${tierDisplay}`,
    html,
  });
}

export async function sendIngestionCompleted(
  email: string,
  platform: string,
  eventCount: number
) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
          .success { background: #d4edda; padding: 10px; border-left: 4px solid #28a745; margin: 15px 0; }
          .button { display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Ingestion Complete</h1>
          </div>
          <div class="content">
            <p>Hi,</p>
            <p>Your sales data ingestion from ${platform} has completed successfully!</p>
            <div class="success">
              <strong>✓ ${eventCount} sales events imported</strong>
            </div>
            <p>Your dashboard has been updated with the latest sales data. Check it out to see your performance!</p>
            <a href="${env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">View Dashboard</a>
          </div>
          <div class="footer">
            <p>© 2025 AuthorStack. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendTransactionalEmail({
    to: email,
    subject: `Sales data from ${platform} imported successfully`,
    html,
  });
}

export async function sendIngestionFailed(
  email: string,
  platform: string,
  errorMessage: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
          .error { background: #f8d7da; padding: 10px; border-left: 4px solid #dc3545; margin: 15px 0; }
          .button { display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Ingestion Failed</h1>
          </div>
          <div class="content">
            <p>Hi,</p>
            <p>We encountered an issue while importing sales data from ${platform}.</p>
            <div class="error">
              <strong>Error:</strong> ${errorMessage}
            </div>
            <p>Please check your connection settings and try again. If the problem persists, contact support.</p>
            <a href="${env.NEXT_PUBLIC_APP_URL}/dashboard/connections" class="button">Check Connections</a>
          </div>
          <div class="footer">
            <p>© 2025 AuthorStack. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendTransactionalEmail({
    to: email,
    subject: `Sales data import from ${platform} failed`,
    html,
  });
}

