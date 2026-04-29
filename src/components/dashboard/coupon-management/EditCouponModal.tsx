"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ICoupon, DiscountType } from "@/redux/features/coupon/coupon.api";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface EditCouponModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon: ICoupon | null;
  isLoading: boolean;
  onSubmit: (data: EditCouponFormData) => Promise<void>;
}

export interface EditCouponFormData {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit?: number;
  isActive: boolean;
}

export function EditCouponModal({
  open,
  onOpenChange,
  coupon,
  isLoading,
  onSubmit,
}: EditCouponModalProps) {
  const [formData, setFormData] = useState<EditCouponFormData>({
    code: "",
    discountType: "PERCENT",
    discountValue: 0,
    minOrderAmount: undefined,
    maxDiscount: undefined,
    expiryDate: "",
    usageLimit: undefined,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (coupon && open) {
      setTimeout(() => {
        setFormData({
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          minOrderAmount: coupon.minOrderAmount,
          maxDiscount: coupon.maxDiscount,
          expiryDate: coupon.expiryDate.split("T")[0],
          usageLimit: coupon.usageLimit,
          isActive: coupon.isActive ?? true,
        });
        setErrors({});
      }, 100);
    }
  }, [coupon, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) newErrors.code = "Coupon code is required";
    if (formData.discountValue <= 0)
      newErrors.discountValue = "Discount value must be greater than 0";
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Edit coupon error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 bg-linear-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-950">
        <ScrollArea className="max-h-[80vh] pr-2">
          {/* Header */}
          <DialogHeader className="px-6 py-3 bg-white rounded-t-lg sticky top-0 z-10">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <span>✎</span> Edit Coupon
            </DialogTitle>
            <DialogDescription className="text-sm">
              Update coupon details and settings
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="px-6 py-3 space-y-6">
            {/* Coupon Code */}
            <div className="space-y-2">
              <Label htmlFor="code" className="font-semibold text-foreground">
                Coupon Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
                placeholder="e.g., SUMMER20"
                className="font-mono tracking-widest border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.code && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.code}
                </p>
              )}
            </div>

            {/* Discount Type & Value Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Discount Type */}
              <div className="space-y-2">
                <Label htmlFor="type" className="font-semibold text-foreground">
                  Discount Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      discountType: value as DiscountType,
                    })
                  }
                >
                  <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENT">Percentage (%)</SelectItem>
                    <SelectItem value="FIXED">Fixed Amount (৳)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Discount Value */}
              <div className="space-y-2">
                <Label
                  htmlFor="value"
                  className="font-semibold text-foreground"
                >
                  Discount Value <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="value"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountValue: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                    className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                    {formData.discountType === "PERCENT" ? "%" : "৳"}
                  </span>
                </div>
                {errors.discountValue && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.discountValue}
                  </p>
                )}
              </div>
            </div>

            {/* Min Order & Max Discount Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Min Order Amount */}
              <div className="space-y-2">
                <Label
                  htmlFor="minOrder"
                  className="font-semibold text-foreground"
                >
                  Min Order Amount (৳){" "}
                  <span className="text-gray-400">Optional</span>
                </Label>
                <Input
                  id="minOrder"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.minOrderAmount ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minOrderAmount: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="No minimum"
                  className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Max Discount */}
              <div className="space-y-2">
                <Label
                  htmlFor="maxDiscount"
                  className="font-semibold text-foreground"
                >
                  Max Discount (৳){" "}
                  {formData.discountType === "PERCENT" && (
                    <span className="text-gray-400">Optional</span>
                  )}
                </Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.maxDiscount ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxDiscount: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="No limit"
                  className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Expiry Date & Usage Limit Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Expiry Date */}
              <div className="space-y-2">
                <Label
                  htmlFor="expiry"
                  className="font-semibold text-foreground"
                >
                  Expiry Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="expiry"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                  className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.expiryDate && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.expiryDate}
                  </p>
                )}
              </div>

              {/* Usage Limit */}
              <div className="space-y-2">
                <Label
                  htmlFor="limit"
                  className="font-semibold text-foreground"
                >
                  Usage Limit <span className="text-gray-400">Optional</span>
                </Label>
                <Input
                  id="limit"
                  type="number"
                  min="1"
                  value={formData.usageLimit ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usageLimit: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="Unlimited"
                  className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg">
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  Active Status
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {formData.isActive
                    ? "This coupon is currently active and can be used"
                    : "This coupon is inactive and cannot be used"}
                </p>
              </div>
              <Select
                value={formData.isActive ? "active" : "inactive"}
                onValueChange={(value) =>
                  setFormData({ ...formData, isActive: value === "active" })
                }
              >
                <SelectTrigger className="w-24 border-blue-300 dark:border-blue-700 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Footer Buttons */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="px-6 hover:cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="px-8 hover:cursor-pointer bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold transition-all duration-300 hover:shadow-lg active:scale-95 disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block animate-spin">⟳</span>
                    Updating...
                  </span>
                ) : (
                  "✓ Update Coupon"
                )}
              </Button>
            </div>
          </form>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
