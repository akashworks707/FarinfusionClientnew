/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { useGetAllProductsQuery } from "@/redux/features/product/product.api";
import { IProduct } from "@/types";

interface SearchDropdownProps {
  query: string;
  onClose: () => void;
//   containerRef: React.RefObject<HTMLDivElement>;
}

const MAX_PREVIEW = 5;

export function SearchDropdown({ query, onClose }: SearchDropdownProps) {
  const router = useRouter();
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce 350ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  const skip = debouncedQuery.trim().length < 2;

  const { data, isFetching } = useGetAllProductsQuery(
    { searchTerm: debouncedQuery.trim(), limit: MAX_PREVIEW, page: 1 },
    { skip }
  );

  const products: IProduct[] = data?.data ?? [];

  // Don't render if query too short
  if (skip) return null;

  const handleProductClick = (slug: string) => {
    router.push(`/product/${slug}`);
    onClose();
  };

  const handleViewAll = () => {
    router.push(`/shop?search=${encodeURIComponent(debouncedQuery.trim())}`);
    onClose();
  };

  return (
    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xl dark:border-gray-700/60 dark:bg-gray-900 animate-in fade-in slide-in-from-top-2 duration-200">
      {isFetching ? (
        <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Searching…
        </div>
      ) : products.length === 0 ? (
        <div className="flex items-center gap-2 px-4 py-6 text-sm text-gray-400">
          <Search className="h-4 w-4" />
          No results for &quot;{debouncedQuery}&quot;
        </div>
      ) : (
        <>
          {/* Product rows */}
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {products.map((product) => {
              const price = product.discountPrice ?? product.price ?? 0;
              return (
                <li key={product._id}>
                  <button
                    onClick={() => handleProductClick(product.slug as string)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-amber-50/60 dark:hover:bg-amber-900/10"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.title ?? ""}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400 text-xs">
                          No img
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-50 leading-snug">
                        {product.title}
                      </p>
                      {product.category && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {(product.category as any)?.title ?? ""}
                        </p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-amber-500">
                        ৳ {price.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                      </p>
                      {product.discountPrice && product.price && product.discountPrice < product.price && (
                        <p className="text-[11px] text-gray-400 line-through tabular-nums">
                          ৳ {product.price.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                        </p>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* VIEW ALL RESULTS footer */}
          <button
            onClick={handleViewAll}
            className="w-full border-t border-gray-100 py-3.5 text-center text-xs font-bold uppercase tracking-widest text-gray-700 transition-colors hover:bg-amber-50 hover:text-amber-700 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-amber-900/10 dark:hover:text-amber-400"
          >
            View All Results
          </button>
        </>
      )}
    </div>
  );
}