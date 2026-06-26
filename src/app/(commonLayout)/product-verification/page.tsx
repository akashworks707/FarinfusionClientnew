import { Metadata } from "next";
import ProductVerificationClient from "@/components/public-view/productVerification/ProductVerificationClient";

export const metadata: Metadata = {
  title: "Product Verification Guide | Farin Fusion",
  description:
    "Learn how to identify original and fake products. Watch official verification videos, guides and tutorials before purchasing.",
  keywords:
    "product verification, authentic products, fake products, how to identify",
  openGraph: {
    title: "Product Verification Guide | Farin Fusion",
    description:
      "Learn how to identify original and fake products with our comprehensive guides and tutorials.",
    type: "website",
  },
};

export default function ProductVerificationPage() {
  return <ProductVerificationClient />;
}