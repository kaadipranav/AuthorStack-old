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
    return null;
  }
  const profile = await services.user.getCurrentProfile();

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page header */}
      <div className="flex flex-col gap-3">
        <h1 className="text-display text-ink">Profile Settings</h1>
        <p className="text-body-lg text-charcoal">
          Manage your account information, subscription, and security settings.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Account details - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card className="border-stroke bg-surface shadow-soft">
            <CardHeader className="pb-6">
              <CardTitle className="text-heading-2 text-ink">Account Details</CardTitle>
              <CardDescription className="text-body text-charcoal">
                Update your personal information and profile picture.
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
        </div>

        {/* Session and security - Takes 1 column */}
        <div className="space-y-6">
          <Card className="border-stroke bg-surface shadow-soft">
            <CardHeader className="pb-4">
              <CardTitle className="text-heading-3 text-ink">Session</CardTitle>
              <CardDescription className="text-small text-charcoal">
                Signed in as <span className="font-medium text-ink">{user.email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-glass border border-stroke">
                <p className="text-small font-medium text-ink mb-1">Email Status</p>
                <p className="text-small text-charcoal">
                  {user.emailVerified ? (
                    <span className="text-forest">✓ Verified</span>
                  ) : (
                    <span className="text-amber">Pending verification</span>
                  )}
                </p>
              </div>
              <Button asChild variant="outline" className="border-stroke text-ink hover:bg-glass w-full">
                <Link href="/auth/forgot-password">Reset password</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Sign out */}
          <Card className="border-stroke bg-surface shadow-soft">
            <CardHeader className="pb-4">
              <CardTitle className="text-heading-3 text-ink">Sign Out</CardTitle>
              <CardDescription className="text-small text-charcoal">
                End your current session
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

          {/* Account Info */}
          <Card className="border-stroke bg-surface shadow-soft">
            <CardHeader className="pb-4">
              <CardTitle className="text-heading-3 text-ink">Account Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-small font-medium text-ink mb-1">User ID</p>
                <p className="text-xs text-charcoal font-mono bg-glass px-2 py-1 rounded border border-stroke break-all">
                  {user.id}
                </p>
              </div>
              <div>
                <p className="text-small font-medium text-ink mb-1">Subscription</p>
                <p className="text-small text-charcoal capitalize">
                  {profile?.subscriptionTier ?? "Free"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

