import type { Metadata } from "next";
import { ProductVerificationClient } from "@/components/dashboard/product-verification/ProductVerificationClient";

export const metadata: Metadata = {
  title: "Product Verification Management | Admin Dashboard",
  description: "Manage product verification tutorials, videos, PDFs, guides and customer education resources.",
  keywords: ["product verification", "verification", "management", "admin"],
  openGraph: {
    title: "Product Verification Management",
    description: "Manage product verification tutorials and educational resources",
  },
};

export default function ProductVerificationPage() {
  return <ProductVerificationClient />;
}