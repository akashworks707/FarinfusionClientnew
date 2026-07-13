import { pushDataLayer } from "./dataLayer";

export const trackPageView = (page: string) => {
  pushDataLayer({
    event: "page_view",
    page,
  });
};