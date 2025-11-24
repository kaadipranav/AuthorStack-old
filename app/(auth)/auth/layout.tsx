import Image from "next/image";
import type { ReactNode } from "react";

import { PublicShell } from "@/components/layout/public-shell";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <PublicShell hideAuthLinks mainClassName="flex min-h-[calc(100vh-160px)] flex-col justify-center gap-12 pb-24">
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Background pattern - only visible in light mode */}
        <div className="absolute inset-0 bg-auth-bg bg-cover bg-center dim:hidden" />

        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-white/40 dim:bg-transparent" />

        <div className="relative z-10 w-full max-w-md space-y-8 rounded-2xl border border-stroke bg-surface p-8 shadow-xl">
          {children}
        </div>
      </div>
    </PublicShell>
  );
}