import Image from "next/image";
import type { ReactNode } from "react";

import { PublicShell } from "@/components/layout/public-shell";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <PublicShell hideAuthLinks mainClassName="flex min-h-[calc(100vh-160px)] flex-col justify-center gap-12 pb-24">
      <div className="relative min-h-screen bg-auth-bg bg-cover bg-center flex items-center justify-center">
        {/* Adaptive overlay for readability in both light and dim modes */}
        <div className="absolute inset-0 bg-white/40 dim:bg-charcoal/85" />
        <div className="relative z-10 w-full max-w-md space-y-8 rounded-2xl border border-burgundy/10 bg-surface/95 backdrop-blur-md p-8 shadow-xl shadow-burgundy/10">
          {children}
        </div>
      </div>
    </PublicShell>
  );
}