/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast as showToast } from "sonner";
import { Search, X, Package, ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PurchaseProduct {
  product: string;
  quantity: number;
  buyingPrice: number;
  totalAmount: number;
}

interface PurchaseFormData {
  products: PurchaseProduct[];
  supplierName: string;
  supplierPhone: string;
  supplierAddress?: string;
  grandTotal?: number;
  invoiceNo?: string;
  reference?: string;
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

interface SelectedProduct {
  productId: string;
  title: string;
  buyingPrice: number;
  quantity: number;
  image?: string;
  price?: number;
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
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    [],
  );
  const [productSearch, setProductSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = React.useState<PurchaseFormData>({
    products: [],
    supplierName: "",
    supplierPhone: "",
    supplierAddress: "",
    invoiceNo: "",
    reference: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    purchaseStatus: "PENDING",
    paymentStatus: "UNPAID",
    notes: "",
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        products: initialData.products || [],
        supplierName: initialData.supplierName || "",
        supplierPhone: initialData.supplierPhone || "",
        supplierAddress: initialData.supplierAddress || "",
        invoiceNo: initialData.invoiceNo || "",
        reference: initialData.reference || "",
        purchaseDate: initialData.purchaseDate
          ? new Date(initialData.purchaseDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        purchaseStatus: initialData.purchaseStatus || "PENDING",
        paymentStatus: initialData.paymentStatus || "UNPAID",
        notes: initialData.notes || "",
      });
      // Initialize selected products from initialData
      if (initialData.products && Array.isArray(initialData.products)) {
        setSelectedProducts(
          initialData.products.map((item: any) => ({
            productId: item.product?._id || item.product,
            title: item.product?.title || "",
            buyingPrice: item.buyingPrice || 0,
            quantity: item.quantity || 0,
            image: item.product?.images?.[0],
            price: item.product?.price,
          })),
        );
      }
      setErrors({});
    } else {
      setFormData({
        products: [],
        supplierName: "",
        supplierPhone: "",
        supplierAddress: "",
        invoiceNo: "",
        reference: "",
        purchaseDate: new Date().toISOString().split("T")[0],
        purchaseStatus: "PENDING",
        paymentStatus: "UNPAID",
        notes: "",
      });
      setSelectedProducts([]);
      setErrors({});
    }
    setProductSearch("");
  }, [initialData, open]);

  const addProduct = (product: any) => {
    setSelectedProducts((prev) => {
      const existing = prev.find((p) => p.productId === product._id);
      if (existing) {
        return prev.map((p) =>
          p.productId === product._id ? { ...p, quantity: p.quantity + 1 } : p,
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          title: product.title,
          buyingPrice: product.price || 0,
          quantity: 1,
          image: product.images?.[0],
          price: product.price,
        },
      ];
    });
    setProductSearch("");
    setDropdownOpen(false);
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.filter((p) => p.productId !== productId),
    );
  };

  const updateProductQty = (productId: string, delta: number) => {
    setSelectedProducts((prev) =>
      prev
        .map((p) =>
          p.productId === productId
            ? { ...p, quantity: Math.max(1, p.quantity + delta) }
            : p,
        )
        .filter((p) => p.quantity > 0),
    );
  };

  // const updateProductPrice = (productId: string, newPrice: number) => {
  //   setSelectedProducts((prev) =>
  //     prev.map((p) =>
  //       p.productId === productId ? { ...p, buyingPrice: newPrice } : p
  //     )
  //   );
  // };

  const alreadySelected = (id: string) =>
    selectedProducts.some((p) => p.productId === id);

  const filteredProducts = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p._id?.includes(productSearch),
  );

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (selectedProducts.length === 0) {
      newErrors.products = "Please add at least one product";
    }

    if (!formData.supplierName.trim()) {
      newErrors.supplierName = "Supplier name is required";
    }

    if (!formData.supplierPhone.trim()) {
      newErrors.supplierPhone = "Supplier phone is required";
    } else if (formData.supplierPhone.length < 10) {
      newErrors.supplierPhone = "Valid phone number required";
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast.error("Please fix the errors above");
      return;
    }

    try {
      setIsSubmitting(true);

      // Map selected products to the backend format
      const purchaseProducts = selectedProducts.map((sp) => ({
        product: sp.productId,
        quantity: sp.quantity,
        buyingPrice: sp.buyingPrice,
        totalAmount: sp.buyingPrice * sp.quantity,
      }));

      const grandTotal = purchaseProducts.reduce(
        (sum, p) => sum + p.totalAmount,
        0,
      );

      const submitData: PurchaseFormData = {
        ...formData,
        products: purchaseProducts,
        grandTotal,
      };

      // console.log("Submitting purchase data:", submitData);

      await onSubmit(submitData);
      onOpenChange(false);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const grandTotal = selectedProducts.reduce(
    (sum, p) => sum + p.buyingPrice * p.quantity,
    0,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-2xl gap-0 p-0 overflow-hidden rounded-2xl border-gray-200/80 dark:border-gray-700/60 max-h-[90vh]">
        <div className="h-1 w-full bg-linear-to-r from-amber-500 via-orange-500 to-yellow-500" />

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
            <Package className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-base font-bold text-gray-900 dark:text-gray-50">
              {initialData ? "Edit Purchase" : "Create New Purchase"}
            </DialogTitle>
          </div>
          {selectedProducts.length > 0 && (
            <div className="shrink-0 rounded-full bg-amber-50 px-3 py-1 dark:bg-amber-900/20">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                {selectedProducts.length} Item
                {selectedProducts.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Body with ScrollArea */}
        <ScrollArea className="h-[calc(90vh-180px)]">
          <div className="px-6 py-5">
            <form
              onSubmit={handleSubmit}
              id="purchase-form"
              className="space-y-6"
            >
              {/* Product Selection Section */}
              <div className="space-y-3">
                <Label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  <Package className="h-3 w-3 text-amber-500 dark:text-amber-400" />
                  Products ({selectedProducts.length})
                </Label>

                {errors.products && (
                  <p className="text-xs text-red-500">{errors.products}</p>
                )}

                {/* Search Products */}
                <div ref={dropdownRef} className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search and add products…"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    onFocus={() => setDropdownOpen(true)}
                    className="h-9 rounded-lg border-gray-200 bg-gray-50/60 pl-9 pr-8 text-sm transition-colors placeholder:text-gray-400 focus:border-amber-400 focus:bg-white dark:border-gray-700 dark:bg-gray-800/60 dark:placeholder:text-gray-600 dark:focus:border-amber-500 dark:focus:bg-gray-800"
                  />
                  {productSearch && (
                    <button
                      type="button"
                      onClick={() => setProductSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-56 rounded-xl border border-gray-200/80 bg-white shadow-lg dark:border-gray-700/60 dark:bg-gray-900">
                      <ScrollArea className="h-56">
                        <div className="p-2">
                          {filteredProducts.length === 0 ? (
                            <p className="px-3 py-3 text-xs text-gray-400">
                              No products found
                            </p>
                          ) : (
                            filteredProducts.map((product) => {
                              const inCart = alreadySelected(product._id);
                              return (
                                <button
                                  key={product._id}
                                  type="button"
                                  onClick={() => {
                                    if (!inCart) addProduct(product);
                                  }}
                                  disabled={inCart}
                                  className={cn(
                                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors mb-1",
                                    inCart
                                      ? "cursor-default opacity-50"
                                      : "hover:bg-amber-50/60 dark:hover:bg-amber-900/10",
                                  )}
                                >
                                  {product.images?.[0] ? (
                                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                                      <Image
                                        src={product.images[0]}
                                        alt={product.title}
                                        fill
                                        sizes="36px"
                                        className="object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20">
                                      <ImageIcon className="h-4 w-4 text-amber-400" />
                                    </div>
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                                      {product.title}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      ৳{(product.price || 0).toFixed(2)}
                                    </p>
                                  </div>
                                  {inCart && (
                                    <Badge
                                      variant="outline"
                                      className="shrink-0 rounded-full border-amber-200 bg-amber-50 text-[10px] text-amber-600 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                                    >
                                      Added
                                    </Badge>
                                  )}
                                </button>
                              );
                            })
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>

                {/* Selected Products */}
                {selectedProducts.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-amber-200 py-8 dark:border-amber-900/30">
                    <Package className="h-8 w-8 text-amber-300 dark:text-amber-800" />
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      No products — search above to add
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedProducts.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-800/30"
                      >
                        {item.image ? (
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20">
                            <Package className="h-4 w-4 text-amber-400" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            ৳{(item.buyingPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateProductQty(item.productId, -1)}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateProductQty(item.productId, 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => removeProduct(item.productId)}
                            className="ml-2 flex h-7 w-7 items-center justify-center rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Supplier Info */}
              <div className="space-y-3">
                <Label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  <span>👤</span>
                  Supplier Information
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="supplierName"
                      className="text-sm font-medium"
                    >
                      Supplier Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="supplierName"
                      placeholder="Enter supplier name"
                      value={formData.supplierName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          supplierName: e.target.value,
                        })
                      }
                      className={errors.supplierName ? "border-red-500" : ""}
                    />
                    {errors.supplierName && (
                      <p className="text-xs text-red-500">
                        {errors.supplierName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="supplierPhone"
                      className="text-sm font-medium"
                    >
                      Supplier Phone <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="supplierPhone"
                      placeholder="Enter phone number"
                      value={formData.supplierPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          supplierPhone: e.target.value,
                        })
                      }
                      className={errors.supplierPhone ? "border-red-500" : ""}
                    />
                    {errors.supplierPhone && (
                      <p className="text-xs text-red-500">
                        {errors.supplierPhone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="supplierAddress"
                    className="text-sm font-medium"
                  >
                    Supplier Address (Optional)
                  </Label>
                  <Input
                    id="supplierAddress"
                    placeholder="Enter supplier address"
                    value={formData.supplierAddress || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        supplierAddress: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-3">
                <Label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  <span>📦</span>
                  Order Details
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNo" className="text-sm font-medium">
                      Invoice Number (Optional)
                    </Label>
                    <Input
                      id="invoiceNo"
                      placeholder="INV-001"
                      value={formData.invoiceNo}
                      onChange={(e) =>
                        setFormData({ ...formData, invoiceNo: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reference" className="text-sm font-medium">
                      Reference (Optional)
                    </Label>
                    <Input
                      id="reference"
                      placeholder="Reference number"
                      value={formData.reference}
                      onChange={(e) =>
                        setFormData({ ...formData, reference: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="purchaseDate"
                      className="text-sm font-medium"
                    >
                      Purchase Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          purchaseDate: e.target.value,
                        })
                      }
                      className={errors.purchaseDate ? "border-red-500" : ""}
                    />
                    {errors.purchaseDate && (
                      <p className="text-xs text-red-500">
                        {errors.purchaseDate}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Grand Total</Label>
                    <div className="flex items-center h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 font-semibold text-blue-600 dark:text-blue-400">
                      ৳{grandTotal.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="purchaseStatus"
                    className="text-sm font-medium"
                  >
                    Purchase Status <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.purchaseStatus}
                    onValueChange={(value) =>
                      setFormData({ ...formData, purchaseStatus: value })
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
                      <SelectItem value="RECEIVED">Received</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.purchaseStatus && (
                    <p className="text-xs text-red-500">
                      {errors.purchaseStatus}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="paymentStatus"
                    className="text-sm font-medium"
                  >
                    Payment Status <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.paymentStatus}
                    onValueChange={(value) =>
                      setFormData({ ...formData, paymentStatus: value })
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
                    <p className="text-xs text-red-500">
                      {errors.paymentStatus}
                    </p>
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
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="resize-none min-h-24"
                />
              </div>
            </form>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/50">
          <div className="flex gap-2 sm:gap-3 justify-end">
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
              form="purchase-form"
              disabled={isSubmitting || selectedProducts.length === 0}
              className="hover:cursor-pointer bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800"
            >
              {isSubmitting
                ? initialData
                  ? "Updating..."
                  : "Creating..."
                : initialData
                  ? "Update Purchase"
                  : "Create Purchase"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
