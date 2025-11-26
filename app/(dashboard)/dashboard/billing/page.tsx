import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Crown, 
  CreditCard, 
  Calendar, 
  ArrowUpRight, 
  Check, 
  Zap,
  AlertCircle,
  RefreshCw,
  Receipt,
  Shield
} from "lucide-react";

// Plan details for display
const planDetails = {
  free: {
    name: "Free",
    price: "$0",
    icon: Zap,
    color: "text-charcoal",
    bgColor: "bg-glass",
    features: ["2 platform connections", "Basic dashboard", "Launch checklists", "AI chat (5/day)"],
  },
  pro: {
    name: "Pro",
    price: "$29/mo",
    icon: Crown,
    color: "text-burgundy",
    bgColor: "bg-burgundy/10",
    features: ["Unlimited platforms", "AI assistant", "Revenue forecasting", "A/B testing"],
  },
};

export default async function BillingPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  // Fetch profile with subscription info
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, subscription_tier, whop_customer_id, created_at")
    .eq("id", user.id)
    .single();

  // Fetch subscription details if exists
  const { data: subscription } = await supabase
    .from("whop_subscriptions")
    .select("*")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const currentTier = (profile?.subscription_tier || "free") as keyof typeof planDetails;
  const plan = planDetails[currentTier];
  const Icon = plan.icon;

  // Calculate days until renewal
  const renewalDate = subscription?.current_period_end
    ? new Date(subscription.current_period_end)
    : null;
  const daysUntilRenewal = renewalDate
    ? Math.ceil((renewalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif text-ink mb-2">Billing & Subscription</h1>
        <p className="text-charcoal">Manage your subscription, view invoices, and update payment methods.</p>
      </div>

      {/* Current Plan Card */}
      <Card className="border-2 border-stroke">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl ${plan.bgColor} flex items-center justify-center`}>
                <Icon className={`h-7 w-7 ${plan.color}`} />
              </div>
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  {plan.name} Plan
                  {currentTier !== "free" && (
                    <span className="text-xs bg-forest/10 text-forest px-2 py-1 rounded-full font-normal">
                      Active
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="text-lg">{plan.price}</CardDescription>
              </div>
            </div>
            {currentTier === "free" && (
              <Button asChild className="bg-burgundy hover:bg-burgundy/90 text-surface">
                <Link href="/pricing">
                  Upgrade to Pro
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Plan features */}
            <div>
              <h3 className="text-sm font-medium text-charcoal mb-3">Your plan includes:</h3>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-ink">
                    <Check className="h-4 w-4 text-forest" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Billing info */}
            <div className="space-y-4">
              {subscription && renewalDate ? (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-glass">
                    <Calendar className="h-5 w-5 text-burgundy" />
                    <div>
                      <p className="text-sm font-medium text-ink">Next billing date</p>
                      <p className="text-sm text-charcoal">
                        {renewalDate.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {daysUntilRenewal && daysUntilRenewal > 0 && (
                          <span className="text-xs ml-2">({daysUntilRenewal} days)</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-glass">
                    <RefreshCw className="h-5 w-5 text-burgundy" />
                    <div>
                      <p className="text-sm font-medium text-ink">Auto-renewal</p>
                      <p className="text-sm text-charcoal">
                        {subscription.status === "active" ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  </div>
                </>
              ) : currentTier === "free" ? (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-burgundy/5 border border-burgundy/20">
                  <AlertCircle className="h-5 w-5 text-burgundy flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-ink">Unlock more features</p>
                    <p className="text-sm text-charcoal mt-1">
                      Upgrade to Pro to access AI assistant, revenue forecasting, and unlimited platform connections.
                    </p>
                    <Button asChild size="sm" className="mt-3 bg-burgundy hover:bg-burgundy/90 text-surface">
                      <Link href="/pricing">View Plans</Link>
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="border-stroke">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-burgundy" />
            Payment Method
          </CardTitle>
          <CardDescription>
            Manage your payment details securely through our payment provider.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profile?.whop_customer_id ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded flex items-center justify-center">
                  <span className="text-xs text-white font-medium">••••</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">Card on file</p>
                  <p className="text-xs text-charcoal">Managed through Whop</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-stroke">
                Update
              </Button>
            </div>
          ) : (
            <div className="text-center py-6">
              <CreditCard className="h-12 w-12 text-charcoal/30 mx-auto mb-3" />
              <p className="text-sm text-charcoal mb-3">No payment method on file</p>
              <Button asChild variant="outline" size="sm" className="border-stroke">
                <Link href="/pricing">Add Payment Method</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="border-stroke">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-burgundy" />
            Billing History
          </CardTitle>
          <CardDescription>
            View your past invoices and payment history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentTier !== "free" && subscription ? (
            <div className="space-y-3">
              {/* Mock invoice - in production, fetch from Whop API */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-stroke">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-glass flex items-center justify-center">
                    <Receipt className="h-5 w-5 text-charcoal" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">{plan.name} Plan</p>
                    <p className="text-xs text-charcoal">
                      {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-ink">{plan.price.replace("/mo", "")}</p>
                  <span className="text-xs bg-forest/10 text-forest px-2 py-0.5 rounded-full">Paid</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Receipt className="h-12 w-12 text-charcoal/30 mx-auto mb-3" />
              <p className="text-sm text-charcoal">No billing history yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      {currentTier !== "free" && (
        <Card className="border-danger/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-danger">
              <AlertCircle className="h-5 w-5" />
              Cancel Subscription
            </CardTitle>
            <CardDescription>
              Cancel your subscription. You&apos;ll retain access until the end of your billing period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="border-danger/30 text-danger hover:bg-danger/10">
              Cancel Subscription
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Security Note */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-glass border border-stroke">
        <Shield className="h-5 w-5 text-forest flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-ink">Secure payments</p>
          <p className="text-xs text-charcoal">
            All payments are processed securely through Whop. We never store your card details directly.
            Your data is protected with bank-level encryption.
          </p>
        </div>
      </div>
    </div>
  );
}
