import { env } from "@/lib/env";
import { cacheApiResponse, getCachedResponse } from "@/lib/cache/redis";

const LULU_API_BASE = "https://api.lulu.com";
const LULU_API_VERSION = "v1";

export interface LuluProject {
    id: string;
    title: string;
    cover: {
        source_url?: string;
    };
    interior: {
        color: boolean;
        page_count: number;
    };
    pod_package_id: string;
    created_at: string;
}

export interface LuluPrintJob {
    id: string;
    line_item_id: string;
    status: "CREATED" | "UNPAID" | "PAYMENT_IN_PROGRESS" | "PRODUCTION_READY" | "IN_PRODUCTION" | "SHIPPED" | "CANCELED" | "ERROR";
    quantity: number;
    cost: {
        total_cost_excl_tax: number;
        total_cost_incl_tax: number;
        total_tax: number;
        shipping_cost: {
            total_cost_excl_tax: number;
            total_cost_incl_tax: number;
        };
    };
    production_delay?: number;
    tracking?: {
        carrier?: string;
        tracking_number?: string;
        tracking_urls?: string[];
    };
    created_at: string;
    updated_at?: string;
}

export interface LuluOrder {
    id: string;
    line_items: Array<{
        id: string;
        project_id: string;
        title: string;
        quantity: number;
        shipping_level: string;
        status: string;
    }>;
    total_cost: {
        currency: string;
        amount: number;
    };
    created_at: string;
}

/**
 * Get OAuth access token for Lulu Print API
 * Uses client credentials flow
 */
async function getLuluAccessToken(): Promise<string | null> {
    if (!env.LULU_API_KEY || !env.LULU_API_SECRET) {
        console.warn("[Lulu] API credentials missing");
        return null;
    }

    const cacheKey = "lulu:access_token";
    const cached = await getCachedResponse(cacheKey);
    if (cached) {
        return cached as string;
    }

    try {
        const credentials = Buffer.from(
            `${env.LULU_API_KEY}:${env.LULU_API_SECRET}`
        ).toString("base64");

        const response = await fetch(`${LULU_API_BASE}/auth/realms/glasstree/protocol/openid-connect/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${credentials}`,
            },
            body: "grant_type=client_credentials",
        });

        if (!response.ok) {
            throw new Error(`Failed to get access token: ${response.status}`);
        }

        const data = (await response.json()) as {
            access_token: string;
            expires_in: number;
        };

        // Cache token for slightly less than expiration time
        const cacheSeconds = data.expires_in - 60;
        await cacheApiResponse(cacheKey, data.access_token, cacheSeconds);

        console.log("[Lulu] ✓ Access token obtained");
        return data.access_token;
    } catch (error) {
        console.error("[Lulu] Token error:", error);
        return null;
    }
}

/**
 * Fetch all projects from Lulu account
 */
export async function fetchLuluProjects(): Promise<LuluProject[]> {
    const token = await getLuluAccessToken();
    if (!token) {
        console.warn("[Lulu] No access token, returning empty projects");
        return [];
    }

    console.log("[Lulu] Fetching projects");

    // Check cache first
    const cached = await getCachedResponse("lulu:projects");
    if (cached) {
        console.log("[Lulu] ✓ Projects from cache");
        return cached as LuluProject[];
    }

    try {
        const response = await fetch(`${LULU_API_BASE}/${LULU_API_VERSION}/projects/`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Cache-Control": "no-cache",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.status}`);
        }

        const data = (await response.json()) as { results: LuluProject[] };
        const projects = data.results || [];

        // Cache for 1 hour
        await cacheApiResponse("lulu:projects", projects, 3600);

        console.log(`[Lulu] ✓ Fetched ${projects.length} projects`);
        return projects;
    } catch (error) {
        console.error("[Lulu] Fetch projects error:", error);
        throw error;
    }
}

/**
 * Fetch print jobs (orders) from Lulu account
 * @param limit - Maximum number of results (default 50)
 * @param offset - Offset for pagination (default 0)
 */
export async function fetchLuluPrintJobs(
    limit: number = 50,
    offset: number = 0
): Promise<LuluPrintJob[]> {
    const token = await getLuluAccessToken();
    if (!token) {
        console.warn("[Lulu] No access token, returning empty print jobs");
        return [];
    }

    console.log(`[Lulu] Fetching print jobs (limit: ${limit}, offset: ${offset})`);

    try {
        const url = `${LULU_API_BASE}/${LULU_API_VERSION}/print-jobs/?limit=${limit}&offset=${offset}`;

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Cache-Control": "no-cache",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch print jobs: ${response.status}`);
        }

        const data = (await response.json()) as { results: LuluPrintJob[] };
        const printJobs = data.results || [];

        console.log(`[Lulu] ✓ Fetched ${printJobs.length} print jobs`);
        return printJobs;
    } catch (error) {
        console.error("[Lulu] Fetch print jobs error:", error);
        throw error;
    }
}

/**
 * Fetch all print jobs with pagination
 */
export async function fetchAllLuluPrintJobs(): Promise<LuluPrintJob[]> {
    const token = await getLuluAccessToken();
    if (!token) {
        console.warn("[Lulu] No access token, returning empty print jobs");
        return [];
    }

    console.log("[Lulu] Fetching all print jobs with pagination");

    const allPrintJobs: LuluPrintJob[] = [];
    let offset = 0;
    const limit = 50;
    let hasMore = true;

    while (hasMore) {
        const printJobs = await fetchLuluPrintJobs(limit, offset);

        if (printJobs.length === 0) {
            hasMore = false;
        } else {
            allPrintJobs.push(...printJobs);
            offset += limit;

            // Rate limiting: be conservative with API calls
            if (printJobs.length < limit) {
                hasMore = false;
            } else {
                await new Promise((resolve) => setTimeout(resolve, 500));
            }
        }
    }

    console.log(`[Lulu] ✓ Total print jobs fetched: ${allPrintJobs.length}`);
    return allPrintJobs;
}

/**
 * Get details of a specific print job
 */
export async function getLuluPrintJob(printJobId: string): Promise<LuluPrintJob | null> {
    const token = await getLuluAccessToken();
    if (!token) {
        console.warn("[Lulu] No access token");
        return null;
    }

    try {
        const response = await fetch(
            `${LULU_API_BASE}/${LULU_API_VERSION}/print-jobs/${printJobId}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch print job: ${response.status}`);
        }

        const printJob = (await response.json()) as LuluPrintJob;
        return printJob;
    } catch (error) {
        console.error("[Lulu] Get print job error:", error);
        return null;
    }
}

/**
 * Calculate profit from a print job
 * @param printJob - Print job object
 * @param sellingPrice - Price you sold the book for (optional)
 */
export function calculateLuluProfit(
    printJob: LuluPrintJob,
    sellingPrice?: number
): number {
    const printCost = printJob.cost.total_cost_incl_tax;

    if (!sellingPrice) {
        // Return negative cost if no selling price provided
        return -printCost;
    }

    const profit = sellingPrice - printCost;
    return profit;
}
