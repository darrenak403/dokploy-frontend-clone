// app/providers.tsx
"use client";
import { ThemeProvider } from "next-themes";

import { SwrProvider } from "@/hook";
import { HeroUIProvider } from "@heroui/react";

import ReduxProvider from "@/redux/Provider";

import { DiscloresuresProvider } from "@/hook/singleton/discloresures";

import ModalsRoot from "@/components/modules/Modal/ModalRoot";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <HeroUIProvider>
        <ReduxProvider>
          <DiscloresuresProvider>
            <SwrProvider>
              {children}
              <ModalsRoot />
            </SwrProvider>
          </DiscloresuresProvider>
        </ReduxProvider>
      </HeroUIProvider>
    </ThemeProvider>
  );
}
