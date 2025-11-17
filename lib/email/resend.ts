import { Resend } from "resend";

import { env } from "@/lib/env";

export const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

type SendTransactionalInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendTransactionalEmail(input: SendTransactionalInput) {
  if (!resend || !env.FROM_EMAIL) {
    throw new Error("Resend is not configured. Provide RESEND_API_KEY and FROM_EMAIL.");
  }

  return resend.emails.send({
    from: env.FROM_EMAIL,
    to: input.to,
    subject: input.subject,
    html: input.html,
  });
}

