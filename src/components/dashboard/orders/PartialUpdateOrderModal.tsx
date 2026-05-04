/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus } from "lucide-react";
import type { Order } from "@/types/orders";
import { toast } from "sonner";
import { useGetAllProductsQuery } from "@/redux/features/product/product.api";

interface PartialUpdateOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onSubmit: (data: any) => Promise<void>;
}

export function PartialUpdateOrderModal({
  open,
  onOpenChange,
  order,
  onSubmit,
}: PartialUpdateOrderModalProps) {
  const [removeItems, setRemoveItems] = useState<
    Array<{ itemIndex: number; quantity: number }>
  >([]);
  const [addItems, setAddItems] = useState<
    Array<{ productId: string; quantity: number }>
  >([]);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: productsData } = useGetAllProductsQuery({ limit: 500 });
  const allProducts = productsData?.data || [];

  const availableProductsForAdd = useMemo(() => {
    const usedIds = new Set(
      order?.products?.map((p: any) => p.product?._id || p.product) || [],
    );
    return allProducts?.filter((p) => !usedIds.has(p._id)) || [];
  }, [allProducts, order?.products]);

  const newTotal = useMemo(() => {
    let total = order?.total || 0;

    removeItems.forEach(({ itemIndex, quantity }) => {
      const item = (order?.products as any[])?.[itemIndex];
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
  ) => {
    if (quantity > availableQty) {
      toast.error("Quantity exceeds available");
      return;
    }
    const existing = removeItems.find((r) => r.itemIndex === itemIndex);
    if (existing) {
      setRemoveItems(
        removeItems.map((r) =>
          r.itemIndex === itemIndex ? { ...r, quantity } : r,
        ),
      );
    } else {
      setRemoveItems([...removeItems, { itemIndex, quantity }]);
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
        removeItems,
        addItems,
        note,
      });
      setRemoveItems([]);
      setAddItems([]);
      setNote("");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to update order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl">
        <div className="h-1 w-full bg-linear-to-r from-blue-500 via-cyan-500 to-teal-500" />

        <DialogHeader className="border-b pb-4">
          <DialogTitle>Partially Update Order</DialogTitle>
          <DialogDescription>
            Order #{order?.customOrderId || order?._id?.slice(0, 10)} - Remove
            or add items
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Remove Items Section */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-red-600" />
              Remove Items
            </Label>
            {order?.products && order.products.length > 0 ? (
              <div className="space-y-2 border rounded-lg p-4 bg-red-50 dark:bg-red-900/10">
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
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                        removeItem
                          ? "bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-700"
                          : "bg-white dark:bg-gray-800 border-red-200 dark:border-red-900/30"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-sm">
                          {product.title || "Unknown Product"}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          ৳{item.price} × {item.quantity} = ৳
                          {(item.price || 0) * item.quantity}
                        </p>
                      </div>
                      {!removeItem && (
                        <div className="flex items-center gap-2 ml-4">
                          <Input
                            type="number"
                            min="1"
                            max={item.quantity}
                            defaultValue="1"
                            className="w-16 h-8 text-sm"
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
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                      {removeItem && (
                        <div className="text-red-600 dark:text-red-400 text-xs font-semibold ml-4 px-2 py-1 bg-red-200/30 rounded">
                          Removing {removeItem.quantity}
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
            <Label className="text-base font-semibold flex items-center gap-2">
              <Plus className="h-4 w-4 text-green-600" />
              Add Items
            </Label>
            <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Select>
                  <SelectTrigger
                    id="add-product-select"
                    className="h-9 text-sm"
                  >
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {availableProductsForAdd.length > 0 ? (
                      availableProductsForAdd.map((product) => (
                        <SelectItem
                          key={product._id}
                          value={product._id ?? ""}
                          className="text-sm"
                        >
                          {product.title} (৳{product.price})
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">
                        No available products
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min="1"
                  placeholder="Qty"
                  id="add-quantity"
                  defaultValue="1"
                  className="h-9 text-sm"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    // const select = document.getElementById('add-product-select')?.querySelector('[role="button"]') as HTMLElement;
                    const input = document.getElementById(
                      "add-quantity",
                    ) as HTMLInputElement;
                    const selectValue = (
                      document.querySelector('[id="add-product-select"]') as any
                    )?.value;
                    const quantity = parseInt(input?.value) || 1;

                    if (!selectValue) {
                      toast.error("Please select a product");
                      return;
                    }

                    handleAddItem(selectValue, quantity);
                    (input as any).value = "1";
                  }}
                  className="bg-green-600 hover:bg-green-700 h-9"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>

              {addItems.length > 0 && (
                <div className="space-y-2 mt-4 pt-4 border-t border-green-200 dark:border-green-900/30">
                  {addItems.map((item, idx) => {
                    const product = allProducts?.find(
                      (p) => p._id === item.productId,
                    );
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700"
                      >
                        <div>
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
              Notes
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
              </div>
            </Card>
          )}
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              (removeItems.length === 0 && addItems.length === 0)
            }
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Updating..." : "Update Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
