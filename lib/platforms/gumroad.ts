import { env } from "@/lib/env";
import { cacheApiResponse, getCachedResponse } from "@/lib/cache/redis";

const GUMROAD_API_BASE = "https://api.gumroad.com/v2";

export interface GumroadProduct {
  id: string;
  name: string;
  url: string;
  created_at: string;
}

export interface GumroadSale {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  currency: string;
  created_at: string;
  customer_email?: string;
}

export interface GumroadToken {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
}

export async function exchangeGumroadCode(code: string): Promise<GumroadToken> {
  if (!env.GUMROAD_API_KEY) {
    throw new Error("GUMROAD_API_KEY missing");
  }

  console.log("[Gumroad] Exchanging code for token");

  try {
    const response = await fetch(`${GUMROAD_API_BASE}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: env.GUMROAD_API_KEY,
        code,
      }).toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[Gumroad] Token exchange failed:", error);
      throw new Error(`Token exchange failed: ${error}`);
    }

    const data = (await response.json()) as {
      access_token: string;
      refresh_token?: string;
      expires_in?: number;
    };

    console.log("[Gumroad] ✓ Token exchanged successfully");

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_in ? Date.now() + data.expires_in * 1000 : undefined,
    };
  } catch (error) {
    console.error("[Gumroad] Exchange error:", error);
    throw error;
  }
}

export async function fetchGumroadProducts(accessToken: string): Promise<GumroadProduct[]> {
  console.log("[Gumroad] Fetching products");

  // Check cache first
  const cached = await getCachedResponse("gumroad:products");
  if (cached) {
    console.log("[Gumroad] ✓ Products from cache");
    return cached as GumroadProduct[];
  }

  try {
    const response = await fetch(`${GUMROAD_API_BASE}/products`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data = (await response.json()) as { products: GumroadProduct[] };
    const products = data.products || [];

    // Cache for 1 hour
    await cacheApiResponse("gumroad:products", products, 3600);

    console.log(`[Gumroad] ✓ Fetched ${products.length} products`);
    return products;
  } catch (error) {
    console.error("[Gumroad] Fetch products error:", error);
    throw error;
  }
}

export async function fetchGumroadSales(
  accessToken: string,
  productId?: string,
  page: number = 1
): Promise<GumroadSale[]> {
  console.log(`[Gumroad] Fetching sales (page: ${page})`);

  try {
    let url = `${GUMROAD_API_BASE}/sales?page=${page}`;
    if (productId) {
      url += `&product_id=${productId}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sales: ${response.status}`);
    }

    const data = (await response.json()) as { sales: GumroadSale[] };
    const sales = data.sales || [];

    console.log(`[Gumroad] ✓ Fetched ${sales.length} sales`);
    return sales;
  } catch (error) {
    console.error("[Gumroad] Fetch sales error:", error);
    throw error;
  }
}

export async function fetchAllGumroadSales(accessToken: string): Promise<GumroadSale[]> {
  console.log("[Gumroad] Fetching all sales with pagination");

  const allSales: GumroadSale[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const sales = await fetchGumroadSales(accessToken, undefined, page);

    if (sales.length === 0) {
      hasMore = false;
    } else {
      allSales.push(...sales);
      page++;

      // Rate limiting: 120 requests/minute = 2 per second
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  console.log(`[Gumroad] ✓ Total sales fetched: ${allSales.length}`);
  return allSales;
}
