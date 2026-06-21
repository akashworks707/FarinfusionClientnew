import { BestSellingProductsClient } from "./BestSellingProductsClient";

async function getBestSellingProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/product/all-products`,
    {
      next: {
        revalidate: 300,
      },
    }
  );

  if (!res.ok) return [];

  const data = await res.json();

  return data?.data || [];
}

export default async function BestSellingProducts() {
  const products = await getBestSellingProducts();

  return <BestSellingProductsClient products={products} />;
}