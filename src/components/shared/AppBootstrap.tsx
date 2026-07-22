"use client";

import { useEffect, useState } from "react";
import AppLoader from "./AppLoader";

export default function AppBootstrap({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Wait for hydration + providers
      await new Promise((resolve) => setTimeout(resolve, 500));

      setReady(true);
    };

    init();
  }, []);

  if (!ready) {
    return <AppLoader visible label="Loading your experience..." />;
  }

  return children;
}