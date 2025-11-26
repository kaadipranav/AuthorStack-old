import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "AuthorStack Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-ink mb-8">Privacy Policy</h1>
        <p className="text-charcoal mb-4">
          <strong>Last updated:</strong> November 26, 2025
        </p>

        <div className="prose prose-burgundy max-w-none space-y-6 text-charcoal">
          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-4">
              1. Information We Collect
            </h2>
            <p>We collect information you provide directly to us:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>Account Information:</strong> Email address, name, and
                password when you create an account
              </li>
              <li>
                <strong>Profile Information:</strong> Author bio, profile
                picture, and social links
              </li>
              <li>
                <strong>Sales Data:</strong> Book sales information you connect
                from third-party platforms
              </li>
              <li>
                <strong>Payment Information:</strong> Processed securely by our
                payment provider (Whop)
              </li>
              <li>
                <strong>Community Content:</strong> Posts, comments, and
                interactions you make
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-4">
              2. How We Use Your Information
            </h2>
            <p>We use collected information to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Provide, maintain, and improve the Service</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Generate analytics and insights for your dashboard</li>
              <li>Power AI features with your sales data context</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-4">
              3. Data Sharing
            </h2>
            <p>
              We do not sell your personal information. We may share information
              with:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>Service Providers:</strong> Companies that help us
                operate the Service (hosting, payments, email)
              </li>
              <li>
                <strong>AI Providers:</strong> Your sales data context is sent
                to OpenRouter for AI features (processed, not stored)
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to
                protect our rights
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-4">
              4. Third-Party Platform Data
            </h2>
            <p>
              When you connect platforms like Amazon KDP or Gumroad, we import
              your sales data to display in your dashboard. This data is:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Stored securely in our database</li>
              <li>Only visible to you (and optionally in anonymized leaderboards)</li>
              <li>Used to generate your analytics and AI insights</li>
              <li>Deletable upon request or account deletion</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-4">
              5. Data Security
            </h2>
            <p>
              We implement appropriate security measures to protect your
              information, including:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Encryption in transit (HTTPS)</li>
              <li>Secure database with row-level security</li>
              <li>Regular security audits</li>
              <li>Limited employee access to user data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-4">
              6. Your Rights
            </h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Export your data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-4">
              7. Cookies and Analytics
            </h2>
            <p>
              We use cookies and similar technologies for authentication and to
              understand how you use the Service. We use PostHog for analytics,
              which collects anonymized usage data to help us improve the
              product.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-4">
              8. Data Retention
            </h2>
            <p>
              We retain your information for as long as your account is active or
              as needed to provide services. You can request deletion of your
              account and data at any time by contacting support.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-4">
              9. Children&apos;s Privacy
            </h2>
            <p>
              AuthorStack is not intended for users under 13 years of age. We do
              not knowingly collect information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-4">
              10. Changes to Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify
              you of any changes by posting the new policy on this page and
              updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-4">
              11. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy, please contact us
              at{" "}
              <a
                href="mailto:privacy@authorstack.com"
                className="text-burgundy hover:underline"
              >
                privacy@authorstack.com
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
