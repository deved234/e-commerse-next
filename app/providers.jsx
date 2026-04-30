"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export default function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      {children}
      <Toaster position="top-right" richColors />
    </SessionProvider>
  );
}
