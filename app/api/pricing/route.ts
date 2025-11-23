import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";

// Query params schema
const pricingQuerySchema = z.object({
  bookId: z.string().uuid(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = await createSupabaseServerClient();

    const searchParams = req.nextUrl.searchParams;
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      return NextResponse.json({ error: "bookId is required" }, { status: 400 });
    }

    // Fetch active recommendations for this book
    const { data: recommendations, error: recError } = await supabase
      .from("pricing_recommendations")
      .select("*")
      .eq("profile_id", user.id)
      .eq("book_id", bookId)
      .gt("expires_at", new Date().toISOString())
      .order("generated_at", { ascending: false })
      .limit(5);

    if (recError) {
      console.error("Pricing recommendations query error:", recError);
      return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
    }

    // If no recommendations exist, generate them
    if (!recommendations || recommendations.length === 0) {
      // Trigger recommendation generation (call helper function)
      const generated = await generatePricingRecommendations(user.id, bookId);
      return NextResponse.json({ recommendations: generated });
    }

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Pricing endpoint error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Helper: Generate rule-based pricing recommendations
async function generatePricingRecommendations(profileId: string, bookId: string) {
  const supabase = await createSupabaseServerClient();

  // Fetch book details
  const { data: book } = await supabase
    .from("books")
    .select("*")
    .eq("id", bookId)
    .single();

  if (!book) {
    return [];
  }

  // Fetch pricing history
  const { data: priceHistory } = await supabase
    .from("pricing_snapshots")
    .select("*")
    .eq("book_id", bookId)
    .order("snapshot_date", { ascending: false })
    .limit(30);

  // Fetch recent sales data
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: recentSales } = await supabase
    .from("sales_events")
    .select("*")
    .eq("book_id", bookId)
    .gte("occurred_at", thirtyDaysAgo.toISOString());

  const recommendations = [];

  // Rule 1: Check if sales dropped after recent price change
  if (priceHistory && priceHistory.length >= 2) {
    const latestPrice = priceHistory[0];
    const previousPrice = priceHistory[1];

    const salesAfterChange = recentSales?.filter(
      (s) => new Date(s.occurred_at) >= new Date(latestPrice.created_at)
    );
    const salesBeforeChange = recentSales?.filter(
      (s) => new Date(s.occurred_at) < new Date(latestPrice.created_at)
    );

    const revenueAfter = salesAfterChange?.reduce((sum, s) => sum + Number(s.amount), 0) || 0;
    const revenueBefore = salesBeforeChange?.reduce((sum, s) => sum + Number(s.amount), 0) || 0;

    if (latestPrice.price > previousPrice.price && revenueAfter < revenueBefore * 0.7) {
      recommendations.push({
        profile_id: profileId,
        book_id: bookId,
        recommendation_type: "revert",
        suggested_price: previousPrice.price,
        reasoning: `Sales dropped ${Math.round(((revenueBefore - revenueAfter) / revenueBefore) * 100)}% after price increase from $${previousPrice.price} to $${latestPrice.price}. Consider reverting.`,
        metadata: { previousPrice: previousPrice.price, currentPrice: latestPrice.price },
      });
    }
  }

  // Rule 2: Compare to category average (placeholder - requires competitor data)
  // In real implementation, fetch competitor prices by category
  const avgCategoryPrice = 9.99; // Placeholder
  const currentPrice = priceHistory?.[0]?.price || 0;

  if (currentPrice < avgCategoryPrice * 0.8) {
    recommendations.push({
      profile_id: profileId,
      book_id: bookId,
      recommendation_type: "increase",
      suggested_price: avgCategoryPrice,
      reasoning: `Your price ($${currentPrice}) is significantly below category average ($${avgCategoryPrice}). Consider increasing to capture more value.`,
      metadata: { categoryAverage: avgCategoryPrice, currentPrice },
    });
  }

  // Rule 3: Maintain if performance is stable
  if (recommendations.length === 0) {
    recommendations.push({
      profile_id: profileId,
      book_id: bookId,
      recommendation_type: "maintain",
      suggested_price: currentPrice,
      reasoning: "Current pricing appears optimal based on recent sales performance.",
      metadata: { currentPrice },
    });
  }

  // Insert recommendations into database
  if (recommendations.length > 0) {
    await supabase.from("pricing_recommendations").insert(recommendations);
  }

  return recommendations;
}
