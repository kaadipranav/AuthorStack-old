import { env } from "@/lib/env";
import { cacheApiResponse, getCachedResponse } from "@/lib/cache/redis";

const PAYHIP_API_BASE = "https://payhip.com/api/v1";

export interface PayhipProduct {
    id: string;
    name: string;
    price: number;
    currency: string;
    type: "digital" | "physical" | "membership";
    created_at: string;
}

export interface PayhipSale {
    id: string;
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
    currency: string;
    buyer_email: string;
    created_at: string;
    status: "completed" | "pending" | "refunded";
}

export interface PayhipLicense {
    id: string;
    product_id: string;
    license_key: string;
    created_at: string;
    activated_at?: string;
}

/**
 * Fetch all products from Payhip account
 */
export async function fetchPayhipProducts(): Promise<PayhipProduct[]> {
    if (!env.PAYHIP_API_KEY) {
        console.warn("[Payhip] API key missing, returning empty products");
        return [];
    }

    console.log("[Payhip] Fetching products");

    // Check cache first
    const cached = await getCachedResponse("payhip:products");
    if (cached) {
        console.log("[Payhip] ✓ Products from cache");
        return cached as PayhipProduct[];
    }

    try {
        const response = await fetch(`${PAYHIP_API_BASE}/products`, {
            headers: {
                "payhip-api-key": env.PAYHIP_API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = (await response.json()) as { products: PayhipProduct[] };
        const products = data.products || [];

        // Cache for 1 hour
        await cacheApiResponse("payhip:products", products, 3600);

        console.log(`[Payhip] ✓ Fetched ${products.length} products`);
        return products;
    } catch (error) {
        console.error("[Payhip] Fetch products error:", error);
        throw error;
    }
}

/**
 * Fetch sales from Payhip account
 * @param startDate - Optional start date for filtering (ISO string)
 * @param endDate - Optional end date for filtering (ISO string)
 */
export async function fetchPayhipSales(
    startDate?: string,
    endDate?: string
): Promise<PayhipSale[]> {
    if (!env.PAYHIP_API_KEY) {
        console.warn("[Payhip] API key missing, returning empty sales");
        return [];
    }

    console.log("[Payhip] Fetching sales");

    try {
        let url = `${PAYHIP_API_BASE}/sales`;
        const params = new URLSearchParams();

        if (startDate) params.append("start_date", startDate);
        if (endDate) params.append("end_date", endDate);

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url, {
            headers: {
                "payhip-api-key": env.PAYHIP_API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch sales: ${response.status}`);
        }

        const data = (await response.json()) as { sales: PayhipSale[] };
        const sales = data.sales || [];

        console.log(`[Payhip] ✓ Fetched ${sales.length} sales`);
        return sales;
    } catch (error) {
        console.error("[Payhip] Fetch sales error:", error);
        throw error;
    }
}

/**
 * Fetch all sales with pagination support
 */
export async function fetchAllPayhipSales(): Promise<PayhipSale[]> {
    if (!env.PAYHIP_API_KEY) {
        console.warn("[Payhip] API key missing, returning empty sales");
        return [];
    }

    console.log("[Payhip] Fetching all sales");

    try {
        // Payhip API typically returns all sales in a single call
        // If pagination is needed in the future, add page parameter
        const sales = await fetchPayhipSales();

        console.log(`[Payhip] ✓ Total sales fetched: ${sales.length}`);
        return sales;
    } catch (error) {
        console.error("[Payhip] Fetch all sales error:", error);
        throw error;
    }
}

/**
 * Fetch license keys for a product
 */
export async function fetchPayhipLicenses(
    productId: string
): Promise<PayhipLicense[]> {
    if (!env.PAYHIP_API_KEY) {
        console.warn("[Payhip] API key missing, returning empty licenses");
        return [];
    }

    console.log(`[Payhip] Fetching licenses for product ${productId}`);

    try {
        const response = await fetch(`${PAYHIP_API_BASE}/licenses?product_id=${productId}`, {
            headers: {
                "payhip-api-key": env.PAYHIP_API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch licenses: ${response.status}`);
        }

        const data = (await response.json()) as { licenses: PayhipLicense[] };
        const licenses = data.licenses || [];

        console.log(`[Payhip] ✓ Fetched ${licenses.length} licenses`);
        return licenses;
    } catch (error) {
        console.error("[Payhip] Fetch licenses error:", error);
        throw error;
    }
}

/**
 * Verify Payhip webhook signature
 * @param payload - Raw webhook payload string
 * @param signature - Signature from webhook header
 */
export async function verifyPayhipWebhook(
    payload: string,
    signature: string
): Promise<{ valid: boolean; reason?: string }> {
    if (!env.PAYHIP_WEBHOOK_SECRET) {
        console.warn("[Payhip] Webhook secret not set, skipping verification");
        return {
            valid: true,
            reason: "Mock mode: signature verification disabled",
        };
    }

    try {
        const crypto = await import("crypto");

        const expectedSignature = crypto
            .createHmac("sha256", env.PAYHIP_WEBHOOK_SECRET)
            .update(payload)
            .digest("hex");

        const isValid = crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        );

        return {
            valid: isValid,
            reason: isValid ? "Signature valid" : "Signature mismatch",
        };
    } catch (error) {
        console.error("[Payhip] Webhook verification error:", error);
        return {
            valid: false,
            reason: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
