import { NextResponse } from "next/server";

type Params = {
  params: {
    provider: string;
  };
};

export async function POST(request: Request, { params }: Params) {
  const payload = await request.json().catch(() => ({}));

  return NextResponse.json({
    provider: params.provider,
    message: "Webhook received. Validate signature + enqueue ingestion in Step 8.",
    payload,
  });
}

