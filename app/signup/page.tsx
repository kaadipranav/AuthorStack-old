export default function SignupPage() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-semibold">Invite-only for now.</h1>
      <p className="max-w-xl text-sm text-charcoal">
        Self-serve signup will open once billing plans solidify. In the meantime, add your keys to `.env.local` and run the workspace locally to experience the product.
      </p>
    </div>
  );
}

