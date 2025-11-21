// app/providers.tsx
"use client";

import { ThemeProvider } from "next-themes";

import { HeroUIProvider } from "@heroui/react";

import ReduxProvider from "@/redux/Provider";

import { DiscloresuresProvider } from "@/hook/singleton/discloresures";
import { SwrProvider } from "@/hook/singleton/swrs";

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
