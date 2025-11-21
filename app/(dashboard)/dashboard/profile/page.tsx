import Link from "next/link";

export const dynamic = "force-dynamic";

import { ProfileForm } from "@/components/forms/profile-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signOutAction } from "@/lib/auth/actions";
import { requireAuth } from "@/lib/auth/session";
import { services } from "@/lib/services";

export default async function ProfilePage() {
  const user = await services.user.getCurrentUser();
  if (!user) {
    // Handle unauthenticated state if requireAuth doesn't catch it (though it should)
    return null;
  }
  const profile = await services.user.getCurrentProfile();

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-display text-ink">Profile Settings</h1>
        <p className="text-body text-charcoal">
          Manage your account information and subscription settings.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Account details */}
        <Card className="border-stroke bg-surface">
          <CardHeader>
            <CardTitle className="text-heading-2 text-ink">Account Details</CardTitle>
            <CardDescription className="text-body text-charcoal">
              Update your personal information and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm
              defaultValues={{
                full_name: user.fullName ?? "",
                avatar_url: user.avatarUrl ?? null,
                subscription_tier: profile?.subscriptionTier ?? "free",
              }}
            />
          </CardContent>
        </Card>

        {/* Session and security */}
        <div className="space-y-6">
          <Card className="border-stroke bg-surface">
            <CardHeader>
              <CardTitle className="text-heading-2 text-ink">Session</CardTitle>
              <CardDescription className="text-body text-charcoal">
                Signed in as {user.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-body font-medium text-ink">Email verified</p>
                <p className="text-small text-charcoal">
                  {user.emailVerified ? "Yes" : "Pending verification"}
                </p>
              </div>
              <div className="pt-2">
                <Button asChild variant="outline" className="border-stroke text-ink hover:bg-glass w-full">
                  <Link href="/auth/forgot-password">Reset password</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sign out */}
          <Card className="border-stroke bg-surface">
            <CardHeader>
              <CardTitle className="text-heading-2 text-ink">Sign Out</CardTitle>
              <CardDescription className="text-body text-charcoal">
                End your current session.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={signOutAction}>
                <Button
                  variant="outline"
                  type="submit"
                  className="border-stroke text-ink hover:bg-glass w-full"
                >
                  Sign out
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

