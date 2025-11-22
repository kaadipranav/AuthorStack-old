import { IngestionJob, IngestionResult, IngestionPlatform } from "./types";

export async function handleAmazonKdpIngestion(job: IngestionJob): Promise<IngestionResult> {
  try {
    const { storagePath } = job.payload as { storagePath?: string };

    if (!storagePath) {
      return {
        success: false,
        jobId: job.id,
        message: "Missing storage path for KDP CSV",
        error: "MISSING_STORAGE_PATH",
      };
    }

    console.log(`[KDP] Processing ingestion for profile ${job.profile_id}, storage path: ${storagePath}`);

    const { createSupabaseServiceClient } = await import("@/lib/supabase/service");
    const supabase = await createSupabaseServiceClient();

    // Download CSV from Supabase Storage
    const { data, error: downloadError } = await supabase.storage
      .from("kdp-uploads")
      .download(storagePath);

    if (downloadError || !data) {
      return {
        success: false,
        jobId: job.id,
        message: "Failed to download CSV",
        error: downloadError?.message || "DOWNLOAD_FAILED",
      };
    }

    // Parse CSV
    const csv = await data.text();
    const lines = csv.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());

    let salesEventsCreated = 0;

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const values = lines[i].split(",").map((v) => v.trim());
      const row: Record<string, string> = {};

      headers.forEach((header, idx) => {
        row[header] = values[idx] || "";
      });

      const asin = row["ASIN"] || row["asin"] || "";
      const title = row["Title"] || row["title"] || "";
      const quantity = parseInt(row["Units Sold"] || row["units_sold"] || "0");
      const amount = parseFloat(row["Royalties"] || row["royalties"] || "0");
      const date = row["Date"] || row["date"] || new Date().toISOString();

      if (asin && quantity > 0) {
        const { error: insertError } = await supabase.from("sales_events").insert({
          profile_id: job.profile_id,
          platform: "amazon_kdp",
          event_type: "sale",
          quantity,
          amount,
          currency: "USD",
          occurred_at: new Date(date).toISOString(),
          raw_payload: { asin, title, ...row },
        });

        if (!insertError) {
          salesEventsCreated++;
        }
      }
    }

    console.log(`[KDP] ✓ Created ${salesEventsCreated} sales events from CSV`);

    return {
      success: true,
      jobId: job.id,
      message: `KDP CSV parsed: ${salesEventsCreated} events created`,
      salesEventsCreated,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[KDP] Ingestion error:", errorMessage);
    return {
      success: false,
      jobId: job.id,
      message: "KDP ingestion failed",
      error: errorMessage,
    };
  }
}

export async function handleGumroadIngestion(job: IngestionJob): Promise<IngestionResult> {
  try {
    const { accessToken } = job.payload as { accessToken?: string };

    if (!accessToken) {
      return {
        success: false,
        jobId: job.id,
        message: "Missing Gumroad access token",
        error: "MISSING_ACCESS_TOKEN",
      };
    }

    console.log(`[Gumroad] Processing ingestion for profile ${job.profile_id}`);

    const { fetchAllGumroadSales } = await import("@/lib/platforms/gumroad");
    const { createSupabaseServiceClient } = await import("@/lib/supabase/service");

    const sales = await fetchAllGumroadSales(accessToken);
    const supabase = await createSupabaseServiceClient();

    let salesEventsCreated = 0;

    for (const sale of sales) {
      const { error } = await supabase.from("sales_events").insert({
        profile_id: job.profile_id,
        platform: "gumroad",
        event_type: "sale",
        quantity: sale.quantity,
        amount: sale.price,
        currency: sale.currency,
        occurred_at: new Date(sale.created_at).toISOString(),
        raw_payload: sale,
      });

      if (!error) {
        salesEventsCreated++;
      }
    }

    console.log(`[Gumroad] ✓ Created ${salesEventsCreated} sales events`);

    return {
      success: true,
      jobId: job.id,
      message: `Gumroad ingestion completed: ${salesEventsCreated} events`,
      salesEventsCreated,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[Gumroad] Ingestion error:", errorMessage);
    return {
      success: false,
      jobId: job.id,
      message: "Gumroad ingestion failed",
      error: errorMessage,
    };
  }
}

export async function handleSmashwordsIngestion(job: IngestionJob): Promise<IngestionResult> {
  try {
    console.log(`[Smashwords] Processing ingestion for profile ${job.profile_id}`);

    const salesEventsCreated = 0;

    return {
      success: true,
      jobId: job.id,
      message: "Smashwords ingestion placeholder: ready for API integration",
      salesEventsCreated,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      jobId: job.id,
      message: "Smashwords ingestion failed",
      error: errorMessage,
    };
  }
}

export async function handleDraft2DigitalIngestion(job: IngestionJob): Promise<IngestionResult> {
  try {
    console.log(`[Draft2Digital] Processing ingestion for profile ${job.profile_id}`);

    const salesEventsCreated = 0;

    return {
      success: true,
      jobId: job.id,
      message: "Draft2Digital ingestion placeholder: ready for API integration",
      salesEventsCreated,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      jobId: job.id,
      message: "Draft2Digital ingestion failed",
      error: errorMessage,
    };
  }
}

export async function handlePayhipIngestion(job: IngestionJob): Promise<IngestionResult> {
  try {
    console.log(`[Payhip] Processing ingestion for profile ${job.profile_id}`);

    const { fetchAllPayhipSales } = await import("@/lib/platforms/payhip");
    const { createSupabaseServiceClient } = await import("@/lib/supabase/service");

    const sales = await fetchAllPayhipSales();
    const supabase = await createSupabaseServiceClient();

    let salesEventsCreated = 0;

    for (const sale of sales) {
      // Only process completed sales
      if (sale.status !== "completed") continue;

      const { error } = await supabase.from("sales_events").insert({
        profile_id: job.profile_id,
        platform: "payhip",
        event_type: "sale",
        quantity: sale.quantity,
        amount: sale.price,
        currency: sale.currency,
        occurred_at: new Date(sale.created_at).toISOString(),
        raw_payload: sale,
      });

      if (!error) {
        salesEventsCreated++;
      }
    }

    console.log(`[Payhip] ✓ Created ${salesEventsCreated} sales events`);

    return {
      success: true,
      jobId: job.id,
      message: `Payhip ingestion completed: ${salesEventsCreated} events`,
      salesEventsCreated,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[Payhip] Ingestion error:", errorMessage);
    return {
      success: false,
      jobId: job.id,
      message: "Payhip ingestion failed",
      error: errorMessage,
    };
  }
}

export async function handleLuluIngestion(job: IngestionJob): Promise<IngestionResult> {
  try {
    console.log(`[Lulu] Processing ingestion for profile ${job.profile_id}`);

    const { fetchAllLuluPrintJobs } = await import("@/lib/platforms/lulu");
    const { createSupabaseServiceClient } = await import("@/lib/supabase/service");

    const printJobs = await fetchAllLuluPrintJobs();
    const supabase = await createSupabaseServiceClient();

    let salesEventsCreated = 0;

    for (const printJob of printJobs) {
      // Only process shipped print jobs as sales
      if (printJob.status !== "SHIPPED") continue;

      const { error } = await supabase.from("sales_events").insert({
        profile_id: job.profile_id,
        platform: "lulu",
        event_type: "sale",
        quantity: printJob.quantity,
        amount: printJob.cost.total_cost_incl_tax,
        currency: "USD", // Lulu typically uses USD
        occurred_at: new Date(printJob.created_at).toISOString(),
        raw_payload: printJob,
      });

      if (!error) {
        salesEventsCreated++;
      }
    }

    console.log(`[Lulu] ✓ Created ${salesEventsCreated} sales events`);

    return {
      success: true,
      jobId: job.id,
      message: `Lulu ingestion completed: ${salesEventsCreated} print jobs`,
      salesEventsCreated,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[Lulu] Ingestion error:", errorMessage);
    return {
      success: false,
      jobId: job.id,
      message: "Lulu ingestion failed",
      error: errorMessage,
    };
  }
}


export async function getHandlerForPlatform(
  platform: IngestionPlatform
): Promise<(job: IngestionJob) => Promise<IngestionResult>> {
  switch (platform) {
    case "amazon_kdp":
      return handleAmazonKdpIngestion;
    case "gumroad":
      return handleGumroadIngestion;
    case "smashwords":
      return handleSmashwordsIngestion;
    case "draft2digital":
      return handleDraft2DigitalIngestion;
    case "payhip":
      return handlePayhipIngestion;
    case "lulu":
      return handleLuluIngestion;
    default:
      throw new Error(`Unknown platform: ${platform}`);
  }
}
