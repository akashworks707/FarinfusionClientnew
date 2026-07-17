import { BestSellingProductsClient } from "./BestSellingProductsClient";

async function getBestSellingProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/product/all-products?isBestSelling=true&limit=500`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) return [];

  const data = await res.json();

  return data?.data || [];
}

export default async function BestSellingProducts() {
  const products = await getBestSellingProducts();

  return <BestSellingProductsClient products={products} />;
}
