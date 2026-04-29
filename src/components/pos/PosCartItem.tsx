"use client";

import { X, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { POSCartItem } from "@/types/pos";
import Image from "next/image";

interface POSCartItemProps {
  item: POSCartItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export function POSCartItemComponent({
  item,
  onQuantityChange,
  onRemove,
}: POSCartItemProps) {
  const { product, quantity } = item;
  const itemTotal = (product.discountPrice || product.price) * quantity;

  return (
    <div className="flex gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      {/* Product Image */}
      {product.images?.[0] && (
        <div className="h-20 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
          <Image
            width={600}
            height={600}
            priority
            quality={90}
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Right side: all content */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-bold leading-snug text-gray-900 dark:text-gray-100">
            {product.title}
          </p>

          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 shrink-0 p-0 text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
            onClick={onRemove}
            aria-label="Remove item"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Price + Quantity + Total */}
        <div className="flex items-center justify-between gap-2">
          {/* Unit price */}
          <span className="text-xs tabular-nums text-gray-500 dark:text-gray-400">
            ৳{(product.discountPrice || product.price).toFixed(2)}
          </span>

          {/* Quantity controls */}
          <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-6 text-center text-xs font-semibold tabular-nums text-gray-900 dark:text-gray-100">
              {quantity}
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => onQuantityChange(quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Line total */}
          <span className="min-w-13 text-right text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">
            ৳{itemTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}