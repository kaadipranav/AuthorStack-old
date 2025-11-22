import { NextRequest, NextResponse } from "next/server";
import { verifyPayhipWebhook } from "@/lib/platforms/payhip";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

interface PayhipWebhookEvent {
    event: "sale" | "subscription_payment" | "refund" | "dispute";
    data: {
        sale_id: string;
        product_id: string;
        product_name: string;
        buyer_email: string;
        quantity: number;
        price: number;
        currency: string;
        created_at: string;
        status: "completed" | "pending" | "refunded";
    };
    timestamp: string;
}

/**
 * POST /api/webhooks/payhip
 * Receives webhooks from Payhip for sales events
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get("x-payhip-signature") || "";

        // Verify webhook signature
        const verification = await verifyPayhipWebhook(body, signature);
        if (!verification.valid) {
            console.error("[Payhip Webhook] Invalid signature:", verification.reason);
            return NextResponse.json(
                { error: "Invalid signature", reason: verification.reason },
                { status: 401 }
            );
        }

        const event: PayhipWebhookEvent = JSON.parse(body);

        console.log(`[Payhip Webhook] Received event: ${event.event}`);

        const supabase = await createSupabaseServiceClient();

        // Find profile by buyer email
        // Note: This is a simplified approach - you may want to link Payhip customer ID to profile
        const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("email", event.data.buyer_email)
            .single();

        if (!profile) {
            console.warn(`[Payhip Webhook] Profile not found for email: ${event.data.buyer_email}`);
        }

        const profileId = profile?.id || null;

        // Log webhook event
        await supabase.from("platform_webhook_events").insert({
            profile_id: profileId,
            provider: "payhip",
            event_type: event.event,
            delivery_status: "received",
            signature,
            payload: event,
            received_at: new Date().toISOString(),
        });

        // Process based on event type
        switch (event.event) {
            case "sale":
            case "subscription_payment":
                if (profileId && event.data.status === "completed") {
                    await supabase.from("sales_events").insert({
                        profile_id: profileId,
                        platform: "payhip",
                        event_type: "sale",
                        quantity: event.data.quantity,
                        amount: event.data.price,
                        currency: event.data.currency,
                        occurred_at: new Date(event.data.created_at).toISOString(),
                        raw_payload: event.data,
                    });

                    console.log(`[Payhip Webhook] Sale recorded for profile ${profileId}`);

                    // Update webhook event status
                    await supabase
                        .from("platform_webhook_events")
                        .update({
                            delivery_status: "processed",
                            processed_at: new Date().toISOString(),
                        })
                        .eq("provider", "payhip")
                        .eq("event_type", event.event)
                        .order("received_at", { ascending: false })
                        .limit(1);

                    return NextResponse.json({
                        status: "success",
                        message: "Sale recorded",
                        profileId,
                    });
                }
                break;

            case "refund":
                if (profileId) {
                    await supabase.from("sales_events").insert({
                        profile_id: profileId,
                        platform: "payhip",
                        event_type: "refund",
                        quantity: -event.data.quantity,
                        amount: -event.data.price,
                        currency: event.data.currency,
                        occurred_at: new Date(event.data.created_at).toISOString(),
                        raw_payload: event.data,
                    });

                    console.log(`[Payhip Webhook] Refund recorded for profile ${profileId}`);
                }
                break;

            case "dispute":
                console.log(`[Payhip Webhook] Dispute event received`);
                // Handle dispute event (notify admin, etc.)
                break;

            default:
                console.log(`[Payhip Webhook] Unhandled event type: ${event.event}`);
        }

        return NextResponse.json({
            status: "acknowledged",
            message: `Event ${event.event} processed`,
        });
    } catch (error) {
        console.error("[Payhip Webhook] Error:", error);
        return NextResponse.json(
            {
                status: "error",
                message: "Failed to process webhook",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
