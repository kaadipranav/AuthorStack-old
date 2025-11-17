import Link from "next/link";

import { DashboardShell } from "@/components/layout/dashboard-shell";
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
    <DashboardShell
      title="Profile"
      description="Manage your account information and subscription tier."
    >
      <div className="grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Account details</CardTitle>
            <CardDescription>Updates sync directly to Supabase profiles.</CardDescription>
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
        <Card>
          <CardHeader>
            <CardTitle>Session</CardTitle>
            <CardDescription>Signed in as {user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Email verified</p>
              <p className="text-sm text-muted-foreground">
                {user.email_confirmed_at ? "Yes" : "Pending verification"}
              </p>
            </div>
            <form action={signOutAction}>
              <Button variant="outline" type="submit">
                Sign out
              </Button>
            </form>
            <Button asChild variant="ghost" className="px-0">
              <Link href="/auth/forgot-password">Reset password</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

