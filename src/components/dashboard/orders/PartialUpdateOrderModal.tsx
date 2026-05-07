/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, Search, X, AlertTriangle } from "lucide-react";
import type { Order } from "@/types/orders";
import { toast } from "sonner";
import { useGetAllProductsQuery } from "@/redux/features/product/product.api";
import { cn } from "@/lib/utils";

interface PartialUpdateOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onSubmit: (data: any) => Promise<void>;
}

interface ItemToRemove {
  itemIndex: number;
  quantity: number;
  isDamage?: boolean;
  damageNote?: string;
}

export function PartialUpdateOrderModal({
  open,
  onOpenChange,
  order,
  onSubmit,
}: PartialUpdateOrderModalProps) {
  const [removeItems, setRemoveItems] = useState<ItemToRemove[]>([]);
  const [addItems, setAddItems] = useState<
    Array<{ productId: string; quantity: number }>
  >([]);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: productsData } = useGetAllProductsQuery({
    search: debouncedSearch || undefined,
    limit: 500,
  });
  const allProducts = productsData?.data || [];

  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchQuery]);

  const availableProductsForAdd = useMemo(() => {
    const usedIds = new Set(
      order?.products?.map((p: any) => p.product?._id || p.product) || [],
    );
    return allProducts?.filter((p) => !usedIds.has(p._id)) || [];
  }, [allProducts, order?.products]);

  const newTotal = useMemo(() => {
    let total = order?.total || 0;

    removeItems.forEach(({ itemIndex, quantity }) => {
      const item = (order?.products as unknown as any[])?.[itemIndex];
      if (item) {
        total -= (item.price || 0) * quantity;
      }
    });

    addItems.forEach(({ productId, quantity }) => {
      const product = allProducts?.find((p) => p._id === productId);
      if (product) {
        total += (product.price || 0) * quantity;
      }
    });

    return Math.max(0, total);
  }, [removeItems, addItems, order, allProducts]);

  const handleRemoveQuantity = (
    itemIndex: number,
    availableQty: number,
    quantity: number,
    isDamage: boolean = false,
    damageNote: string = "",
  ) => {
    if (quantity > availableQty) {
      toast.error("Quantity exceeds available");
      return;
    }
    const existing = removeItems.find((r) => r.itemIndex === itemIndex);
    if (existing) {
      setRemoveItems(
        removeItems.map((r) =>
          r.itemIndex === itemIndex
            ? { ...r, quantity, isDamage, damageNote }
            : r,
        ),
      );
    } else {
      setRemoveItems([
        ...removeItems,
        { itemIndex, quantity, isDamage, damageNote },
      ]);
    }
  };

  const handleAddItem = (selectedProduct: string, quantity: number) => {
    if (!selectedProduct || quantity < 1) return;
    const prod = allProducts?.find((p) => p._id === selectedProduct);
    if (!prod || (prod.availableStock || 0) < quantity) {
      toast.error("Insufficient stock for selected product");
      return;
    }
    setAddItems([...addItems, { productId: selectedProduct, quantity }]);
  };

  const handleSubmit = async () => {
    if (!order) return;

    if (removeItems.length === 0 && addItems.length === 0) {
      toast.error("No changes made");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        orderId: order._id,
        removeItems: removeItems.map((item) => ({
          itemIndex: item.itemIndex,
          quantity: item.quantity,
          isDamage: item.isDamage || false,
          damageNote: item.damageNote || "",
        })),
        addItems,
        note,
      });
      setRemoveItems([]);
      setAddItems([]);
      setNote("");
      setSearchQuery("");
      setDebouncedSearch("");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to update order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] gap-0 p-0 overflow-hidden rounded-xl border-gray-200/80 dark:border-gray-700/60">
        <div className="h-1 w-full bg-linear-to-r from-blue-500 via-cyan-500 to-teal-500" />

        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20">
            <Trash2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-base font-bold">
              Partially Update Order
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-400">
              Order #{order?.customOrderId || order?._id?.slice(0, 10)} - Remove
              or add items
            </DialogDescription>
          </div>
        </div>

        <ScrollArea className="max-h-[calc(90vh-180px)] w-full">
          <div className="space-y-6 px-6 py-5">
            {/* Remove Items Section */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-red-600" />
                Remove Items (Restock/Damage)
              </Label>
              {order?.products && order.products.length > 0 ? (
                <div className="space-y-2 border rounded-lg p-4 bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30">
                  {order.products.map((item: any, index: number) => {
                    const removeItem = removeItems.find(
                      (r) => r.itemIndex === index,
                    );
                    const product =
                      typeof item.product === "object"
                        ? item.product
                        : { title: "Unknown" };

                    return (
                      <div
                        key={index}
                        className={cn(
                          "border rounded-lg p-3 transition-all",
                          removeItem
                            ? "bg-red-100/60 dark:bg-red-900/20 border-red-300 dark:border-red-700"
                            : "bg-white dark:bg-gray-800/50 border-red-200 dark:border-red-900/30",
                        )}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="font-semibold text-sm">
                              {product.title || "Unknown Product"}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              ৳{item.price} × {item.quantity} = ৳
                              {(item.price || 0) * item.quantity}
                            </p>
                          </div>
                          {removeItem && (
                            <Badge className="bg-red-600 dark:bg-red-500">
                              Selected
                            </Badge>
                          )}
                        </div>

                        {!removeItem && (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="1"
                              max={item.quantity}
                              defaultValue="1"
                              className="w-20 h-8 text-sm"
                              id={`remove-qty-${index}`}
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                const input = document.getElementById(
                                  `remove-qty-${index}`,
                                ) as HTMLInputElement;
                                const qty = parseInt(input?.value) || 1;
                                handleRemoveQuantity(index, item.quantity, qty);
                              }}
                              className="text-xs"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Remove
                            </Button>
                          </div>
                        )}

                        {removeItem && (
                          <div className="space-y-3 border-t border-red-200 dark:border-red-900/50 pt-3">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`damage-${index}`}
                                checked={removeItem.isDamage || false}
                                onCheckedChange={(checked) => {
                                  handleRemoveQuantity(
                                    index,
                                    item.quantity,
                                    removeItem.quantity,
                                    !!checked,
                                    removeItem.damageNote || "",
                                  );
                                }}
                              />
                              <Label
                                htmlFor={`damage-${index}`}
                                className="text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                              >
                                <AlertTriangle className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                                Mark as Damage/Loss
                              </Label>
                            </div>

                            {removeItem.isDamage && (
                              <Input
                                placeholder="Damage reason (optional)"
                                value={removeItem.damageNote || ""}
                                onChange={(e) => {
                                  handleRemoveQuantity(
                                    index,
                                    item.quantity,
                                    removeItem.quantity,
                                    true,
                                    e.target.value,
                                  );
                                }}
                                className="h-8 text-xs"
                              />
                            )}

                            <div className="text-xs text-red-700 dark:text-red-300 font-medium">
                              Removing {removeItem.quantity} unit
                              {removeItem.quantity > 1 ? "s" : ""}
                              {removeItem.isDamage && " (as damage)"}
                            </div>

                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full text-xs h-7"
                              onClick={() => {
                                setRemoveItems(
                                  removeItems.filter(
                                    (r) => r.itemIndex !== index,
                                  ),
                                );
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No items to remove
                </p>
              )}
            </div>

            {/* Add Items Section */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Plus className="h-4 w-4 text-green-600" />
                Add Items (Exchange/New)
              </Label>
              <div className="border rounded-lg p-4 bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30 space-y-3">
                {/* Search Input */}
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search products to add…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-sm"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Product List */}
                {availableProductsForAdd.length > 0 ? (
                  <div className="max-h-56 overflow-y-auto rounded-lg border border-green-200 dark:border-green-900/30 bg-white dark:bg-gray-900">
                    <div className="space-y-1 p-2">
                      {availableProductsForAdd.map((product) => (
                        <div
                          key={product._id}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-gray-800 dark:text-gray-200">
                              {product.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              ৳{product.price} · Stock:{" "}
                              {product.availableStock || 0}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Input
                              type="number"
                              min="1"
                              defaultValue="1"
                              className="w-16 h-8 text-xs"
                              id={`qty-${product._id}`}
                            />
                            <Button
                              size="sm"
                              onClick={() => {
                                const input = document.getElementById(
                                  `qty-${product._id}`,
                                ) as HTMLInputElement;
                                const qty = parseInt(input?.value) || 1;
                                handleAddItem(product._id || "", qty);
                                input.value = "1";
                              }}
                              className="h-8 px-2 bg-green-600 hover:bg-green-700"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 py-3 text-center">
                    {searchQuery
                      ? "No products found"
                      : "No available products"}
                  </p>
                )}

                {/* Added Items List */}
                {addItems.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-green-200 dark:border-green-900/30">
                    {addItems.map((item, idx) => {
                      const product = allProducts?.find(
                        (p) => p._id === item.productId,
                      );
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-green-100/60 dark:bg-green-900/20 border border-green-300 dark:border-green-700"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-sm">
                              {product?.title}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              ৳{product?.price} × {item.quantity} = ৳
                              {(product?.price || 0) * item.quantity}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setAddItems(addItems.filter((_, i) => i !== idx));
                            }}
                            className="h-8"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-600" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="update-notes" className="text-sm font-semibold">
                Update Notes (Optional)
              </Label>
              <Textarea
                id="update-notes"
                placeholder="Add notes about this partial update..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-16 text-sm rounded-lg"
              />
            </div>

            {/* Summary */}
            {(removeItems.length > 0 || addItems.length > 0) && (
              <Card className="bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 border-blue-200 dark:border-blue-900/50">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Current Total:</span>
                    <span className="font-semibold">
                      ৳{(order?.total || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-blue-200 dark:border-blue-800 pt-2 flex justify-between items-center">
                    <span className="font-semibold text-sm">New Total:</span>
                    <span className="text-lg font-bold text-blue-700 dark:text-blue-400">
                      ৳{newTotal.toLocaleString()}
                    </span>
                  </div>
                  {newTotal !== order?.total && (
                    <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
                      {newTotal > (order?.total || 0) ? "+" : ""}৳
                      {(newTotal - (order?.total || 0)).toLocaleString()}{" "}
                      difference
                    </p>
                  )}
                  {removeItems.some((item) => item.isDamage) && (
                    <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-amber-200 dark:border-amber-900/50 text-xs text-amber-700 dark:text-amber-400">
                      <AlertTriangle className="h-3 w-3" />
                      <span>
                        {removeItems.filter((item) => item.isDamage).length}{" "}
                        item(s) marked as damage
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="mb-1 border-t border-gray-100 px-6 py-4 dark:border-gray-800 flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="rounded-lg hover:cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              (removeItems.length === 0 && addItems.length === 0)
            }
            className="hover:cursor-pointer rounded-lg gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            {isSubmitting ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Updating…
              </>
            ) : (
              "Update Order"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
