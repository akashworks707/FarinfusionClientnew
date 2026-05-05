/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
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
import { AlertTriangle } from "lucide-react";
import type { Order } from "@/types/orders";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DamageOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onSubmit: (data: any) => Promise<void>;
}

interface DamageItem {
  itemIndex: number;
  quantity: number;
  note: string;
}

export function DamageOrderModal({
  open,
  onOpenChange,
  order,
  onSubmit,
}: DamageOrderModalProps) {
  const [damageItems, setDamageItems] = useState<DamageItem[]>([]);
  const [generalNote, setGeneralNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectDamage = (itemIndex: number, quantity: number) => {
    const existing = damageItems.find((d) => d.itemIndex === itemIndex);
    if (existing) {
      setDamageItems(damageItems.filter((d) => d.itemIndex !== itemIndex));
    } else {
      setDamageItems([...damageItems, { itemIndex, quantity, note: "" }]);
    }
  };

  const handleUpdateNote = (itemIndex: number, note: string) => {
    setDamageItems(
      damageItems.map((d) => (d.itemIndex === itemIndex ? { ...d, note } : d)),
    );
  };

  const totalDamageAmount = useMemo(() => {
    return damageItems.reduce((total, damageItem) => {
      const item = (order?.products as unknown as any[])?.[
        damageItem.itemIndex
      ];
      if (item) {
        return total + (item.price || 0) * damageItem.quantity;
      }
      return total;
    }, 0);
  }, [damageItems, order?.products]);

  const handleSubmit = async () => {
    if (!order) return;

    if (damageItems.length === 0) {
      toast.error("Please select at least one item as damaged");
      return;
    }

    setIsSubmitting(true);
    try {
      for (const damageItem of damageItems) {
        await onSubmit({
          orderId: order._id,
          itemIndex: damageItem.itemIndex,
          quantity: damageItem.quantity,
          note: damageItem.note || generalNote,
        });
      }

      setDamageItems([]);
      setGeneralNote("");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to mark items as damaged");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] gap-0 p-0 overflow-hidden rounded-xl border-gray-200/80 dark:border-gray-700/60">
        <div className="h-1 w-full bg-linear-to-r from-red-500 via-orange-500 to-amber-500" />

        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-base font-bold">
              Mark Items as Damaged
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-400">
              Order #{order?.customOrderId || order?._id?.slice(0, 10)} - Select
              damaged products
            </DialogDescription>
          </div>
        </div>

        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <div className="space-y-4 px-6 py-5">
            {/* Info Alert */}
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/30 dark:bg-red-900/10">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
              <div className="text-xs text-red-700 dark:text-red-300">
                <p className="font-semibold">Mark items as damaged/loss</p>
                <p className="mt-1">
                  This records the product damage and reduces the order total.
                  No stock is returned.
                </p>
              </div>
            </div>

            {/* Product Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">
                Select Damaged Items
              </Label>
              {order?.products && order.products.length > 0 ? (
                <div className="space-y-2">
                  {order.products.map((item: any, index: number) => {
                    const selected = damageItems.find(
                      (d) => d.itemIndex === index,
                    );
                    const product =
                      typeof item.product === "object"
                        ? item.product
                        : { title: "Unknown" };

                    return (
                      <Card
                        key={index}
                        className={cn(
                          "border-2 p-4 transition-all cursor-pointer",
                          selected
                            ? "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/10"
                            : "border-gray-200 hover:border-red-300 dark:border-gray-700 dark:hover:border-red-800",
                        )}
                        onClick={() => {
                          handleSelectDamage(index, item.quantity);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={!!selected}
                            onCheckedChange={(checked) => {
                              if (!checked) {
                                setDamageItems(
                                  damageItems.filter(
                                    (d) => d.itemIndex !== index,
                                  ),
                                );
                              } else {
                                setDamageItems([
                                  ...damageItems,
                                  {
                                    itemIndex: index,
                                    quantity: item.quantity,
                                    note: "",
                                  },
                                ]);
                              }
                            }}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-sm">
                              {product.title || "Unknown Product"}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              ৳{item.price} × {item.quantity} = ৳
                              {(item.price || 0) * item.quantity}
                            </p>
                          </div>
                          {selected && (
                            <Badge className="bg-red-600 dark:bg-red-500 shrink-0">
                              Selected
                            </Badge>
                          )}
                        </div>

                        {/* Damage Note */}
                        {selected && (
                          <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-900/50">
                            <Input
                              placeholder="Reason for damage (e.g., broken, defective)…"
                              value={selected.note}
                              onChange={(e) => {
                                handleUpdateNote(index, e.target.value);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="h-8 text-xs"
                            />
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No items in this order
                </p>
              )}
            </div>

            {/* General Notes */}
            {damageItems.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="damage-notes" className="text-sm font-semibold">
                  General Notes (Optional)
                </Label>
                <Textarea
                  id="damage-notes"
                  placeholder="Add any additional notes about the damage…"
                  value={generalNote}
                  onChange={(e) => setGeneralNote(e.target.value)}
                  className="min-h-20 text-sm rounded-lg"
                />
              </div>
            )}

            {/* Summary */}
            {damageItems.length > 0 && (
              <Card className="bg-linear-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-4 border-red-200 dark:border-red-900/50">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Current Total:</span>
                    <span className="font-semibold">
                      ৳{(order?.total || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-red-200 dark:border-red-800 pt-2 flex justify-between items-center">
                    <span className="font-semibold text-sm">Damage Loss:</span>
                    <span className="text-lg font-bold text-red-700 dark:text-red-400">
                      -৳{totalDamageAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-red-200 dark:border-red-800 pt-2 flex justify-between items-center">
                    <span className="font-semibold text-sm">New Total:</span>
                    <span className="text-lg font-bold text-blue-700 dark:text-blue-400">
                      ৳
                      {Math.max(
                        0,
                        (order?.total || 0) - totalDamageAmount,
                      ).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-red-700 dark:text-red-400 font-medium">
                    {damageItems.length} item(s) marked as damaged
                  </p>
                </div>
              </Card>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="border-t border-gray-100 px-6 py-4 mb-1 dark:border-gray-800 flex gap-2">
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
            disabled={isSubmitting || damageItems.length === 0}
            className="rounded-lg gap-2 hover:cursor-pointer bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
          >
            {isSubmitting ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Processing…
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4" />
                Mark as Damaged
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
