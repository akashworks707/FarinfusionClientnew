/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast as showToast } from "sonner";

interface PurchaseFormData {
  product: string;
  supplierName: string;
  supplierPhone: string;
  quantity: number;
  buyingPrice: number;
  invoiceNo?: string;
  totalAmount?: number;
  purchaseDate: string;
  purchaseStatus: string;
  paymentStatus: string;
  notes?: string;
}

interface ProductPurchaseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
  products?: any[];
  onSubmit: (data: PurchaseFormData) => Promise<void>;
}

export const ProductPurchaseForm: React.FC<ProductPurchaseFormProps> = ({
  open,
  onOpenChange,
  initialData,
  products = [],
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [formData, setFormData] = React.useState<PurchaseFormData>({
    product: "",
    supplierName: "",
    supplierPhone: "",
    quantity: 1,
    buyingPrice: 0,
    totalAmount: 0,
    invoiceNo: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    purchaseStatus: "PENDING",
    paymentStatus: "UNPAID",
    notes: "",
  });

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        product: initialData.product?._id || initialData.product || "",
        supplierName: initialData.supplierName || "",
        supplierPhone: initialData.supplierPhone || "",
        quantity: initialData.quantity || 1,
        buyingPrice: initialData.buyingPrice || 0,
        invoiceNo: initialData.invoiceNo || "",
        totalAmount: initialData?.totalAmount || 0,
        purchaseDate: initialData.purchaseDate
          ? new Date(initialData.purchaseDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        purchaseStatus: initialData.purchaseStatus || "PENDING",
        paymentStatus: initialData.paymentStatus || "UNPAID",
        notes: initialData.notes || "",
      });
      setErrors({});
    } else {
      setFormData({
        product: "",
        supplierName: "",
        supplierPhone: "",
        quantity: 1,
        buyingPrice: 0,
        totalAmount: initialData?.buyingPrice * initialData?.quantity || 0,
        invoiceNo: "",
        purchaseDate: new Date().toISOString().split("T")[0],
        purchaseStatus: "PENDING",
        paymentStatus: "UNPAID",
        notes: "",
      });
      setErrors({});
    }
  }, [initialData, open]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.product.trim()) {
      newErrors.product = "Product is required";
    }

    if (!formData.supplierName.trim()) {
      newErrors.supplierName = "Supplier name is required";
    }

    if (!formData.supplierPhone.trim()) {
      newErrors.supplierPhone = "Supplier phone is required";
    } else if (formData.supplierPhone.length < 10) {
      newErrors.supplierPhone = "Valid phone number required";
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = "Quantity must be at least 1";
    }

    if (formData.buyingPrice < 0.01) {
      newErrors.buyingPrice = "Buying price is required";
    }

    if (!formData.purchaseDate) {
      newErrors.purchaseDate = "Purchase date is required";
    }

    if (!formData.purchaseStatus) {
      newErrors.purchaseStatus = "Purchase status is required";
    }

    if (!formData.paymentStatus) {
      newErrors.paymentStatus = "Payment status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PurchaseFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  useEffect(() => {
    const total =
      Number(formData.quantity || 0) * Number(formData.buyingPrice || 0);

    setFormData((prev) => ({
      ...prev,
      totalAmount: total,
    }));
  }, [formData.quantity, formData.buyingPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);

      const submitData = {
        ...formData,
        totalAmount: Number(formData.quantity) * Number(formData.buyingPrice),
      };

      const res: any = await onSubmit(submitData);

      if (res) {
        showToast.success(
          initialData
            ? "Purchase updated successfully"
            : "Purchase created successfully",
        );

        onOpenChange(false);
      }
    } catch (error: any) {
      showToast.error(error?.message || "Failed to save purchase");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-amber-600 dark:text-amber-400">
            {initialData ? "Edit Purchase" : "Create New Purchase"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Selection */}
          <div className="space-y-2">
            <Label htmlFor="product" className="text-sm font-medium">
              Product <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.product}
              onValueChange={(value) => handleInputChange("product", value)}
            >
              <SelectTrigger
                id="product"
                className={errors.product ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <SelectItem key={product._id} value={product._id}>
                      {product.title}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-products" disabled>
                    No products available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.product && (
              <p className="text-xs text-red-500">{errors.product}</p>
            )}
          </div>

          {/* Supplier Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplierName" className="text-sm font-medium">
                Supplier Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="supplierName"
                placeholder="Enter supplier name"
                value={formData.supplierName}
                onChange={(e) =>
                  handleInputChange("supplierName", e.target.value)
                }
                className={errors.supplierName ? "border-red-500" : ""}
              />
              {errors.supplierName && (
                <p className="text-xs text-red-500">{errors.supplierName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplierPhone" className="text-sm font-medium">
                Supplier Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="supplierPhone"
                placeholder="Enter phone number"
                value={formData.supplierPhone}
                onChange={(e) =>
                  handleInputChange("supplierPhone", e.target.value)
                }
                className={errors.supplierPhone ? "border-red-500" : ""}
              />
              {errors.supplierPhone && (
                <p className="text-xs text-red-500">{errors.supplierPhone}</p>
              )}
            </div>
          </div>

          {/* Quantity and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium">
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                placeholder="0"
                value={formData.quantity}
                onChange={(e) =>
                  handleInputChange("quantity", parseInt(e.target.value) || 0)
                }
                className={errors.quantity ? "border-red-500" : ""}
                min="1"
              />
              {errors.quantity && (
                <p className="text-xs text-red-500">{errors.quantity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyingPrice" className="text-sm font-medium">
                Buying Price <span className="text-red-500">*</span>
              </Label>
              <Input
                id="buyingPrice"
                type="number"
                placeholder="0.00"
                value={formData.buyingPrice}
                onChange={(e) =>
                  handleInputChange(
                    "buyingPrice",
                    parseFloat(e.target.value) || 0,
                  )
                }
                className={errors.buyingPrice ? "border-red-500" : ""}
                min="0.01"
                step="0.01"
              />
              {errors.buyingPrice && (
                <p className="text-xs text-red-500">{errors.buyingPrice}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalAmount" className="text-sm font-medium">
                Total Amount
              </Label>

              <Input
                id="totalAmount"
                type="number"
                value={formData.totalAmount || 0}
                readOnly
                className="bg-muted font-semibold"
              />
            </div>
          </div>

          {/* Invoice and Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNo" className="text-sm font-medium">
                Invoice Number (Optional)
              </Label>
              <Input
                id="invoiceNo"
                placeholder="INV-001"
                value={formData.invoiceNo}
                onChange={(e) => handleInputChange("invoiceNo", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchaseDate" className="text-sm font-medium">
                Purchase Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) =>
                  handleInputChange("purchaseDate", e.target.value)
                }
                className={errors.purchaseDate ? "border-red-500" : ""}
              />
              {errors.purchaseDate && (
                <p className="text-xs text-red-500">{errors.purchaseDate}</p>
              )}
            </div>
          </div>

          {/* Status Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseStatus" className="text-sm font-medium">
                Purchase Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.purchaseStatus}
                onValueChange={(value) =>
                  handleInputChange("purchaseStatus", value)
                }
              >
                <SelectTrigger
                  id="purchaseStatus"
                  className={errors.purchaseStatus ? "border-red-500" : ""}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ORDERED">Ordered</SelectItem>
                  {/* <SelectItem value="SHIPPED">Shipped</SelectItem> */}
                  <SelectItem value="RECEIVED">Received</SelectItem>
                  {/* <SelectItem value="COMPLETED">Completed</SelectItem> */}
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              {errors.purchaseStatus && (
                <p className="text-xs text-red-500">{errors.purchaseStatus}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentStatus" className="text-sm font-medium">
                Payment Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.paymentStatus}
                onValueChange={(value) =>
                  handleInputChange("paymentStatus", value)
                }
              >
                <SelectTrigger
                  id="paymentStatus"
                  className={errors.paymentStatus ? "border-red-500" : ""}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UNPAID">Unpaid</SelectItem>
                  <SelectItem value="PARTIAL">Partial</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                </SelectContent>
              </Select>
              {errors.paymentStatus && (
                <p className="text-xs text-red-500">{errors.paymentStatus}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this purchase..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="resize-none min-h-25"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800"
            >
              {isSubmitting
                ? initialData
                  ? "Updating..."
                  : "Creating..."
                : initialData
                  ? "Update Purchase"
                  : "Create Purchase"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
