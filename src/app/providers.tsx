"use client";

import { ThirdwebProvider } from "thirdweb/react";
import { AppProvider } from "@/context/AppContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider>
      <AppProvider>{children}</AppProvider>
    </ThirdwebProvider>
  );
}
