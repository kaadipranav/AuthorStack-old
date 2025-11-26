import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "AuthorStack Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-ink mb-8">Terms of Service</h1>
        <p className="text-charcoal mb-4">
          <strong>Last updated:</strong> November 26, 2025
        </p>

        <div className="prose prose-burgundy max-w-none space-y-6 text-charcoal">
          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using AuthorStack (&quot;the Service&quot;), you agree to be
              bound by these Terms of Service. If you do not agree to these
              terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-4">
              2. Description of Service
            </h2>
            <p>
              AuthorStack provides indie authors with tools to track book sales,
              analyze revenue across platforms, and manage their publishing
              business. The Service includes dashboard analytics, AI-powered
              insights, community features, and integrations with third-party
              platforms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-4">
              3. User Accounts
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your
              account. You must provide accurate and complete information when
              creating an account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-4">
              4. Subscriptions and Payments
            </h2>
            <p>
              Some features require a paid subscription. Subscriptions are billed
              monthly and will auto-renew unless cancelled. You may cancel your
              subscription at any time through your account settings. Refunds are
              handled on a case-by-case basis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-4">
              5. User Content
            </h2>
            <p>
              You retain ownership of any content you submit to the Service. By
              posting content to community features, you grant AuthorStack a
              non-exclusive license to display and distribute that content within
              the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-4">
              6. Prohibited Conduct
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Use the Service for any illegal purpose</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with the proper functioning of the Service</li>
              <li>Upload malicious code or content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-4">
              7. Third-Party Integrations
            </h2>
            <p>
              The Service integrates with third-party platforms (Amazon KDP,
              Gumroad, etc.). Your use of those platforms is subject to their
              respective terms of service. AuthorStack is not responsible for the
              availability or accuracy of third-party data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-4">
              8. Limitation of Liability
            </h2>
            <p>
              AuthorStack is provided &quot;as is&quot; without warranties of any kind. We
              are not liable for any indirect, incidental, or consequential
              damages arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-4">
              9. Changes to Terms
            </h2>
            <p>
              We may update these terms from time to time. We will notify users
              of significant changes via email or through the Service. Continued
              use after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-4">
              10. Contact
            </h2>
            <p>
              For questions about these Terms, please contact us at{" "}
              <a
                href="mailto:support@authorstack.com"
                className="text-burgundy hover:underline"
              >
                support@authorstack.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-warm-gray">
          <a href="/" className="text-burgundy hover:underline">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
