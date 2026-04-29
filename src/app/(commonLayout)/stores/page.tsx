import Stores from "@/components/public-view/stores/Stores";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Stores | Farin Fusion",
  description:
    "Explore all available stores at Farin Fusion. Discover premium products from trusted brands and categories.",
  keywords: ["stores", "brands", "Farin Fusion", "shopping", "cosmetics"],
  openGraph: {
    title: "All Stores | Farin Fusion",
    description:
      "Browse all stores and explore collections from trusted brands.",
    type: "website",
  },
};

export default function StoresPage() {
  return <Stores />;
}
