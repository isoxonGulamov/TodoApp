"use client";

import { useEffect } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useTheme } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClientOptions:any = {
  defaultOptions: {
    queries: {
      cacheTime: 600000,
    },
  },
};
const queryClient = new QueryClient(queryClientOptions);

export function Providers({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const prevMode = localStorage.getItem("theme");
    if (prevMode) {
      setTheme(prevMode);
    } else {
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  }, [setTheme]);


  
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <NextUIProvider>
          <NextThemesProvider
          >
            {children}
          </NextThemesProvider>
        </NextUIProvider>
      </QueryClientProvider>
    </>
  );
}
