import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth/session";
import { AppLayout } from "@/components/layout/app-layout";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await requireAuth();
  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
}

