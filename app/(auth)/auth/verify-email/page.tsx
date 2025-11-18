export const metadata = {
  title: "Verify Your Email",
};

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-10">
        <div className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 rounded-xl bg-burgundy flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <span className="text-surface text-3xl font-bold">A</span>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-ink leading-tight">Check your inbox</h1>
            <p className="text-lg text-charcoal max-w-md mx-auto transition-colors duration-300 hover:text-charcoal/80">
              We've sent a verification email to your address. Click the link in the email to activate your account.
            </p>
          </div>
        </div>

        <div className="bg-surface border border-stroke rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="space-y-5 text-lg text-charcoal">
            <p className="transition-colors duration-300 hover:text-charcoal/80">
              Didn't receive the email? Check your spam folder or wait 60 seconds and request another email.
            </p>
            <p className="transition-colors duration-300 hover:text-charcoal/80">
              Add <span className="font-medium text-burgundy transition-colors duration-300 hover:text-burgundy/80">noreply@authorstack.com</span> to your contacts to ensure delivery.
            </p>
          </div>
        </div>

        <div className="text-center text-sm text-charcoal transition-colors duration-300 hover:text-charcoal/80">
          Need help? <a href="mailto:support@authorstack.com" className="text-burgundy hover:underline transition-all duration-300 hover:text-burgundy/80">Contact support</a>
        </div>
      </div>
    </div>
  );
}