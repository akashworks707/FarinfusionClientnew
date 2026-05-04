/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Order } from "@/types/orders";
import type { IProduct } from "@/types";
import { RotateCcw, Package, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useExchangeOrderMutation } from "@/redux/features/orders/ordersApi";
import { useGetAllProductsQuery } from "@/redux/features/product/product.api";

interface ExchangeOrderModalProps {
  open: boolean;
  order: Order | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ExchangeOrderModal({
  open,
  order,
  onOpenChange,
  onSuccess,
}: ExchangeOrderModalProps) {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all products for exchange selection
  const { data: productsData } = useGetAllProductsQuery({
    limit: 500,
  });
  const [exchangeOrderItem] = useExchangeOrderMutation();
  const allProducts = productsData?.data || [];

  const orderItem = selectedItemIndex !== null && order?.products ? (order?.products as any[])[selectedItemIndex] : null;

  const handleExchange = async () => {
    if (!order || selectedItemIndex === null || !selectedProduct) {
      toast.error("Please select item and new product");
      return;
    }

    setIsSubmitting(true);
    try {
      await exchangeOrderItem({
        orderId: order._id,
        itemIndex: selectedItemIndex,
        newProductId: selectedProduct,
        note: notes,
      }).unwrap();

      toast.success("Product exchanged successfully");
      onOpenChange(false);
      setSelectedItemIndex(null);
      setSelectedProduct("");
      setNotes("");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || "Failed to process exchange");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!order) return null;

  const newProduct = allProducts.find((p) => p._id === selectedProduct);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-2xl border-gray-200/80 dark:border-gray-700/60 max-w-2xl">
        <div className="h-1 w-full bg-linear-to-r from-amber-500 via-orange-500 to-red-500" />

        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
            <RotateCcw className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <DialogTitle className="text-lg font-bold">
              Exchange Product
            </DialogTitle>
            <DialogDescription>
              Order {order.customOrderId || order._id?.slice(0, 10)}
            </DialogDescription>
          </div>
        </div>

        <div className="space-y-5 px-6 py-5">
          {/* Step 1: Select Item to Exchange */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Select Item to Exchange</Label>
            <div className="space-y-2">
              {order.products && order.products.length > 0 ? (
                order.products.map((item: any, idx: number) => (
                  <Card
                    key={idx}
                    className={`cursor-pointer border-2 p-3 transition-all ${
                      selectedItemIndex === idx
                        ? "border-amber-500 bg-amber-50/50 dark:border-amber-500 dark:bg-amber-900/10"
                        : "border-gray-200 hover:border-amber-300 dark:border-gray-700 dark:hover:border-amber-700/40"
                    }`}
                    onClick={() => {
                      setSelectedItemIndex(idx);
                      setSelectedProduct("");
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                        <Package className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm">{item.title || item.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Qty: {item.quantity} × ৳{(item.price || 0).toLocaleString()}
                        </p>
                      </div>
                      {selectedItemIndex === idx && (
                        <Badge className="shrink-0 bg-amber-600 dark:bg-amber-500">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))
              ) : (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50/50 p-3 dark:border-red-900/30 dark:bg-red-900/10">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-red-700 dark:text-red-300">
                    No items in this order
                  </p>
                </div>
              )}
            </div>
          </div>

          {selectedItemIndex !== null && orderItem && (
            <>
              {/* Current Item Details */}
              <Card className="border-amber-200/50 bg-amber-50/30 dark:border-amber-900/30 dark:bg-amber-900/10 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                  Current Item
                </p>
                <p className="mt-1.5 font-semibold text-sm">
                  {orderItem.title || orderItem.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Price: ৳{(orderItem.price || 0).toLocaleString()} × {orderItem.quantity} units
                </p>
              </Card>

              {/* Step 2: Select New Product */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Select New Product</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="h-10 rounded-lg border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                    <SelectValue placeholder="Choose a product to exchange with…" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg max-h-60">
                    {allProducts.length === 0 ? (
                      <div className="py-6 text-center text-sm text-gray-400">
                        No products available
                      </div>
                    ) : (
                      allProducts.map((product: IProduct) => (
                        <SelectItem
                          key={product._id}
                          value={product._id ?? ""}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span>{product.title}</span>
                            <span className="text-xs text-gray-400">
                              (৳{(product.price || 0).toLocaleString()})
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* New Product Details */}
              {newProduct && (
                <Card className="border-blue-200/50 bg-blue-50/30 dark:border-blue-900/30 dark:bg-blue-900/10 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                    New Product
                  </p>
                  <p className="mt-1.5 font-semibold text-sm">
                    {newProduct.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Price: ৳{(newProduct.price || 0).toLocaleString()}
                  </p>
                  {(newProduct.price || 0) > (orderItem?.price || 0) && (
                    <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                      ℹ️ Additional cost: ৳
                      {(
                        (newProduct.price || 0) - (orderItem?.price || 0)
                      ).toLocaleString()}
                    </p>
                  )}
                  {(newProduct.price || 0) < (orderItem?.price || 0) && (
                    <p className="mt-2 text-xs text-green-600 dark:text-green-400">
                      ℹ️ Refund: ৳
                      {(
                        (orderItem?.price || 0) - (newProduct.price || 0)
                      ).toLocaleString()}
                    </p>
                  )}
                </Card>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-semibold">
                  Exchange Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this exchange…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-20 rounded-lg"
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex gap-2 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleExchange}
            disabled={!selectedProduct || isSubmitting}
            className="rounded-lg gap-2 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Processing…
              </>
            ) : (
              <>
                <RotateCcw className="h-4 w-4" />
                Process Exchange
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
