"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface AppLoaderProps {
  visible?: boolean;
  label?: string;
  fullscreen?: boolean;
  className?: string;
}

export default function AppLoader({
  visible = true,
  label = "Loading your experience",
  fullscreen = true,
  className,
}: AppLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "z-9999 flex flex-col items-center justify-center",
        "bg-white dark:bg-slate-950",
        "transition-opacity duration-500 ease-out",
        visible ? "opacity-100" : "opacity-0 pointer-events-none",
        fullscreen ? "fixed inset-0 h-dvh w-dvw" : "relative h-full w-full",
        className,
      )}
    >
      {/* Ambient amber glow backdrop — purely decorative, GPU-friendly */}
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0 overflow-hidden")}
      >
        <div
          className={cn(
            "absolute left-1/2 top-1/2 h-105 w-105 -translate-x-1/2 -translate-y-1/2",
            "rounded-full bg-amber-400/10 dark:bg-amber-500/10 blur-3xl",
            "animate-loader-glow",
          )}
        />
      </div>

      {/* Center content */}
      <div className="relative flex flex-col items-center gap-6 px-6">
        {/* Logo */}
        <div className="relative flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
          {/* Soft glow ring behind logo */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-loader-pulse-glow"
          />
          <Image
            src="/assets/Farin-Fusion-01.png"
            alt="Farin Fusion"
            width={196}
            height={196}
            priority
            className="relative h-20 w-20 select-none object-contain sm:h-24 sm:w-24 animate-loader-breathe will-change-transform"
          />
        </div>

        {/* Brand name */}
        <div className="flex flex-col items-center gap-1.5">
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white sm:text-xl">
            Farin<span className="text-amber-500">Fusion</span>
          </h1>

          {/* Status text */}
          <p className="text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400 sm:text-sm">
            {label}
          </p>
        </div>

        {/* Loading dots indicator */}
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-loader-dot [animation-delay:-0.32s]" />
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-loader-dot [animation-delay:-0.16s]" />
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-loader-dot" />
        </div>
      </div>

      {/* Screen-reader only fallback text */}
      <span className="sr-only">Page is loading, please wait.</span>
    </div>
  );
}
