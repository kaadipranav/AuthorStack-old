export const metadata = {
  title: "Verify email",
};

export default function VerifyEmailPage() {
  return (
    <div className="space-y-8 text-center">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Email verification</p>
        <h1 className="text-3xl font-semibold text-foreground">Check your inbox to activate AuthorStack</h1>
        <p className="text-sm text-muted-foreground">
          We just sent a verification email. Open it on this device to confirm your identity. Once confirmed, you&apos;ll be
          redirected to the dashboard and launches will begin syncing immediately.
        </p>
      </header>
      <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-primary/10 bg-card/80 px-6 py-5 text-sm text-muted-foreground">
        <p>
          Didn&apos;t receive it? Wait 60 seconds, then request another email from the sign-in screen. Add
          <span className="font-medium text-primary"> noreply@authorstack.com</span> to your contacts to whitelist.
        </p>
        <p>
          Need assistance? Ping the deployment guide or open a GitHub issue—we monitor onboarding requests around the clock.
        </p>
      </div>
    </div>
  );
}

