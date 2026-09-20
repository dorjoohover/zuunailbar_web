"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import {ToastProvider} from "@heroui/toast";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

// declare module "@react-types/shared" {
//   interface RouterConfig {
//     routerOptions: NonNullable<
//       Parameters<ReturnType<typeof useRouter>["push"]>[1]
//     >;
//   }
// }

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push} >
      {/*
        HeroUI-ийн toast нь гарчгийг анхдагчаар `truncate` (нэг мөр) хийдэг тул
        урт текст "…"-ээр таслагдаж харагддаг байсан. Бүх toast-д нийтээр нь
        мөр таслах зөвшөөрөл өгч, өргөнийг нь дэлгэцэд тааруулна.
      */}
      <ToastProvider
        placement="top-center"
        toastProps={{
          timeout: 4000,
          classNames: {
            base: "max-w-[92vw] sm:max-w-md",
            title: "whitespace-normal break-words",
            description: "whitespace-normal break-words",
          },
        }}
      />
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
    </HeroUIProvider>
  );
}
