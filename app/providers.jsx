"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { TranslationProvider } from "@/lib/TranslationContext";

export default function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      <TranslationProvider>
        {children}
        <Toaster position="top-right" richColors />
      </TranslationProvider>
    </SessionProvider>
  );
}
