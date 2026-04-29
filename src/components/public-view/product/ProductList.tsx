"use client";

import React from "react";
import { useGetAllProductsQuery } from "@/redux/features/product/product.api";
import ProductSkeleton from "../home/ProductSkeleton";
import ProductCard from "@/components/public-view/common/ProductCard";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

const ProductList = () => {
  const { data, isLoading, isError } = useGetAllProductsQuery({});

  const productData = data?.data || [];
  const featuredData = productData.filter((item) => item.isFeatured);

  if (isLoading) {
    return (
      <div className="container mx-auto px-5 py-5 sm:py-10">
        <div className="flex items-center justify-between py-5 mb-6">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 py-10">
        Failed to load products 😢
      </p>
    );
  }

  return (
    <div className="container mx-auto px-5 py-5 sm:py-10 ">
      <div className={"flex items-center justify-between py-5"}>
        <div>
          <h3 className={"text-2xl font-bold heading-animate "}>
            Our Featured product
          </h3>
        </div>
        <div>
          <Link
            href={"/shop"}
            className={
              "inline-block text-[12px]  px-5 py-2 bg-yellow-500" +
              " text-white" +
              " rounded-md"
            }
          >
            <span className={"flex items-center gap-1"}>
              ALL PRODUCTS <ArrowRightIcon className={"w-5 h-5"} />
            </span>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {featuredData?.map((item) => (
          <ProductCard key={item?._id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
