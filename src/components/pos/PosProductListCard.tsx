"use client";

import { Star, Plus, PackageX } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { IProduct } from "@/types";

interface POSProductListCardProps {
  product: IProduct;
  onAddToCart: () => void;
  isLoading?: boolean;
}

export function POSProductListCard({
  product,
  onAddToCart,
  isLoading = false,
}: POSProductListCardProps) {
  // const displayPrice = product.discountPrice ?? product.price;
  const displayPrice =
    product.discountPrice && product.discountPrice > 0
      ? product.discountPrice
      : product.price;

  const hasDiscount =
    (product?.discountPrice as number) > 0 &&
    (product?.discountPrice as number) < product.price;

  const discountPercent = hasDiscount
    ? Math.round(
      (((product.price ?? 0) - (product.discountPrice ?? 0)) /
        (product.price ?? 0)) *
      100,
    )
    : 0;

  const isOutOfStock = (product.availableStock ?? 0) === 0;

  return (
    <div
      role="button"
      aria-label={`Add ${product.title} to cart`}
      tabIndex={isOutOfStock || isLoading ? -1 : 0}
      onClick={() => !isOutOfStock && !isLoading && onAddToCart()}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !isOutOfStock && !isLoading)
          onAddToCart();
      }}
      className={cn(
        "pb-1 hover:cursor-pointer group relative flex items-stretch rounded-xl border bg-white overflow-hidden select-none",
        "transition-all duration-200 ease-out dark:bg-gray-900",
        isOutOfStock || isLoading
          ? "opacity-60 cursor-not-allowed border-gray-200 dark:border-gray-800"
          : [
            "cursor-[url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"%230f172a\" opacity=\"0.85\"/><line x1=\"12\" y1=\"7\" x2=\"12\" y2=\"17\" stroke=\"white\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"7\" y1=\"12\" x2=\"17\" y2=\"12\" stroke=\"white\" stroke-width=\"2\" stroke-linecap=\"round\"/></svg>'),_pointer]",
            "border-gray-200 dark:border-gray-700/60",
            "hover:border-blue-400 dark:hover:border-blue-500",
            "hover:shadow-[0_0_0_1px_var(--color-blue-400)] dark:hover:shadow-[0_0_0_1px_var(--color-blue-500)]",
            "active:scale-[0.992] active:shadow-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1",
          ],
      )}
    >
      {/* ── Left: Image ── */}
      <div className="relative h-auto w-20 shrink-0 overflow-hidden rounded-l-xl bg-gray-100 dark:bg-gray-800 sm:w-24">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 80px, 96px"
            className={cn(
              "object-cover transition-transform duration-300",
              !isOutOfStock && "group-hover:scale-105",
            )}
            priority
            quality={85}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <PackageX className="h-6 w-6 text-gray-400 dark:text-gray-600" />
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute left-1 top-1 rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* ── Middle: Info ── */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-3">
        {/* Title — no truncate, wraps naturally */}
        <p className="text-sm font-semibold leading-snug text-gray-900 dark:text-gray-50 sm:text-[15px]">
          {product.title}
        </p>

        {/* Meta row: rating + stock */}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          {(product.ratings ?? 0) > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3",
                      i < Math.round(product.ratings ?? 0)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-transparent text-gray-300 dark:text-gray-600",
                    )}
                  />
                ))}
              </div>
              <span className="text-[11px] font-medium tabular-nums text-gray-500 dark:text-gray-400">
                {(product.ratings ?? 0).toFixed(1)}
              </span>
            </div>
          )}

          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide leading-none",
              isOutOfStock
                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
            )}
          >
            {isOutOfStock ? "Out of stock" : `${product.availableStock} L.`}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end justify-center gap-2 pr-3 sm:pr-4">
        {/* Price stack */}
    
        <div className="flex flex-col items-end">
          <span className="text-sm font-bold tabular-nums text-gray-900 dark:text-gray-50">
            ৳{displayPrice?.toLocaleString()}
          </span>

          {hasDiscount && (
            <span className="text-[10px] tabular-nums text-gray-400 line-through">
              ৳{product.price?.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add indicator — fades in on hover */}
        {!isOutOfStock && !isLoading && (
          <div
            aria-hidden
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full",
              "border border-blue-300 bg-blue-50 text-blue-600",
              "dark:border-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
              "opacity-0 scale-75 transition-all duration-200",
              "group-hover:opacity-100 group-hover:scale-100",
            )}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/* Loading shimmer */}
      {isLoading && (
        <div className="absolute inset-0 animate-pulse rounded-xl bg-white/60 dark:bg-gray-900/60" />
      )}
    </div>
  );
}