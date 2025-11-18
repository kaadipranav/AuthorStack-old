import Link from "next/link";

export const dynamic = "force-dynamic";

import { ProfileForm } from "@/components/forms/profile-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signOutAction } from "@/lib/auth/actions";
import { requireAuth } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const user = await requireAuth();
  const supabase = await createSupabaseServerClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

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
                full_name: profile?.full_name ?? user.email ?? "",
                avatar_url: profile?.avatar_url ?? null,
                subscription_tier: profile?.subscription_tier ?? "free",
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
                  {user.email_confirmed_at ? "Yes" : "Pending verification"}
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

