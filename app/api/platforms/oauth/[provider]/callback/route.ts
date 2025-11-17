import { NextResponse } from "next/server";

type Params = {
  params: { provider: string };
};

export async function GET(request: Request, { params }: Params) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  return NextResponse.json({
    provider: params.provider,
    code,
    state,
    message:
      "OAuth callback received. Implement token exchange + connection persistence in Step 8.",
  });
}

