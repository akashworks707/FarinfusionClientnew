/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

export const pushDataLayer = (event: Record<string, any>) => {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);

  // Development only
  // if (process.env.NODE_ENV === "development") {
  //   console.log("📊 dataLayer", event);
  // }
};