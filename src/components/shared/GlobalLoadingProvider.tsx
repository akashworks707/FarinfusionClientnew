"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import AppLoader from "@/components/shared/AppLoader";

interface GlobalLoadingContextValue {
  isLoading: boolean;
  startLoading: (label?: string) => void;
  stopLoading: () => void;
}

const GlobalLoadingContext = createContext<GlobalLoadingContextValue | null>(
  null,
);

export function useGlobalLoading(): GlobalLoadingContextValue {
  const ctx = useContext(GlobalLoadingContext);
  if (!ctx) {
    throw new Error(
      "useGlobalLoading must be used within a GlobalLoadingProvider",
    );
  }
  return ctx;
}

interface GlobalLoadingProviderProps {
  children: ReactNode;
  minimumDurationMs?: number;
  fadeOutDurationMs?: number;
}

export function GlobalLoadingProvider({
  children,
  minimumDurationMs = 450,
  fadeOutDurationMs = 400,
}: GlobalLoadingProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(true);
  const [visible, setVisible] = useState(true);
  const [label, setLabel] = useState<string | undefined>(undefined);

  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unmountTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shownAtRef = useRef<number>(Date.now());
  const isFirstRender = useRef(true);
  const prevKeyRef = useRef<string>("");

  const clearTimers = useCallback(() => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    if (unmountTimeoutRef.current) clearTimeout(unmountTimeoutRef.current);
  }, []);

  const startLoading = useCallback(
    (nextLabel?: string) => {
      clearTimers();
      shownAtRef.current = Date.now();
      setLabel(nextLabel);
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    },
    [clearTimers],
  );

  const stopLoading = useCallback(() => {
    clearTimers();
    const elapsed = Date.now() - shownAtRef.current;
    const remaining = Math.max(minimumDurationMs - elapsed, 0);

    hideTimeoutRef.current = setTimeout(() => {
      setVisible(false);
      unmountTimeoutRef.current = setTimeout(() => {
        setMounted(false);
        setLabel(undefined);
      }, fadeOutDurationMs);
    }, remaining);
  }, [clearTimers, minimumDurationMs, fadeOutDurationMs]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      stopLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const key = `${pathname}?${searchParams?.toString() ?? ""}`;

    if (isFirstRender.current) {
      prevKeyRef.current = key;
      return;
    }

    if (prevKeyRef.current !== key) {
      prevKeyRef.current = key;
      startLoading();
      stopLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  useEffect(() => clearTimers, [clearTimers]);

  const value = useMemo<GlobalLoadingContextValue>(
    () => ({
      isLoading: mounted && visible,
      startLoading,
      stopLoading,
    }),
    [mounted, visible, startLoading, stopLoading],
  );

  return (
    <GlobalLoadingContext.Provider value={value}>
      {children}
      {mounted && <AppLoader visible={visible} label={label} />}
    </GlobalLoadingContext.Provider>
  );
}
