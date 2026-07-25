"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export default function SonnerProvider() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      expand
      duration={4000}
      theme={
        resolvedTheme === "dark"
          ? "dark"
          : resolvedTheme === "light"
            ? "light"
            : "system"
      }
      toastOptions={{
        classNames: {
          toast: "rounded-xl",
          title: "font-semibold",
          description: "text-sm",
        },
      }}
    />
  );
}
