/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Purchase {
  _id: string;
  product?: { title?: string };
  supplierName: string;
  supplierPhone?: string;
  supplierAddress?: string;
  quantity: number;
  buyingPrice: number;
  totalAmount: number;
  paymentStatus: string;
  purchaseStatus: string;
  invoiceNo?: string;
  reference?: string;
  notes?: string;
  purchaseDate: string;
}

interface ProductPurchaseDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchase: Purchase;
}

const getPurchaseStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING:
      "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200",
    ORDERED: "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200",
    SHIPPED:
      "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-200",
    RECEIVED:
      "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200",
    COMPLETED:
      "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200",
    CANCELLED: "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200",
  };
  return colors[status] || colors.PENDING;
};

const getPaymentStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PAID: "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200",
    PARTIAL:
      "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200",
    UNPAID: "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200",
  };
  return colors[status] || colors.UNPAID;
};

const ProductPurchaseDetailsModal: React.FC<
  ProductPurchaseDetailsModalProps
> = ({ open, onOpenChange, purchase }) => {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const profit = purchase.product
    ? ((purchase.product as any).price || 0) - (purchase.buyingPrice || 0)
    : 0;
  const totalProfit = Math.max(0, profit * (purchase.quantity || 0));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-xl font-bold">
            Purchase Details
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Header Info */}
            <Card className="border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/20">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-amber-900/70 dark:text-amber-200/70 font-semibold">
                      PURCHASE ID
                    </p>
                    <p className="font-mono text-sm font-bold text-amber-900 dark:text-amber-100 mt-1">
                      {purchase._id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-amber-900/70 dark:text-amber-200/70 font-semibold">
                      PURCHASE DATE
                    </p>
                    <p className="font-medium text-amber-900 dark:text-amber-100 mt-1">
                      {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                      PRODUCT NAME
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white mt-1">
                      {purchase.product?.title || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                      QUANTITY
                    </p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                      {purchase.quantity}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supplier Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Supplier Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                    SUPPLIER NAME
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white mt-1">
                    {purchase.supplierName}
                  </p>
                </div>

                {purchase.supplierPhone && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                      PHONE
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {purchase.supplierPhone}
                      </p>
                      <button
                        onClick={() =>
                          copyToClipboard(purchase.supplierPhone || "", "phone")
                        }
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        {copiedField === "phone" ? (
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {purchase.supplierAddress && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                      ADDRESS
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mt-1">
                      {purchase.supplierAddress}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card className="border-2 border-amber-200 dark:border-amber-800/50 bg-amber-50/30 dark:bg-amber-950/10">
              <CardHeader>
                <CardTitle className="text-base text-amber-900 dark:text-amber-100">
                  Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                      UNIT PRICE
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                      ৳{(purchase.buyingPrice || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                      TOTAL AMOUNT
                    </p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-2">
                      ৳{(purchase.totalAmount || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                      PROFIT PER UNIT
                    </p>
                    <p
                      className={`text-lg font-bold mt-2 ${profit > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      ৳{profit.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                      TOTAL PROFIT
                    </p>
                    <p
                      className={`text-lg font-bold mt-2 ${totalProfit > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      ৳{totalProfit.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2">
                      PURCHASE STATUS
                    </p>
                    <Badge
                      className={getPurchaseStatusColor(
                        purchase.purchaseStatus,
                      )}
                    >
                      {purchase.purchaseStatus}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2">
                      PAYMENT STATUS
                    </p>
                    <Badge
                      className={getPaymentStatusColor(purchase.paymentStatus)}
                    >
                      {purchase.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Invoice & Reference */}
            {(purchase.invoiceNo || purchase.reference) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Reference Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {purchase.invoiceNo && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                        INVOICE NO
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                          {purchase.invoiceNo}
                        </p>
                        <button
                          onClick={() =>
                            copyToClipboard(purchase.invoiceNo || "", "invoice")
                          }
                          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          {copiedField === "invoice" ? (
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {purchase.reference && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                        REFERENCE
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                          {purchase.reference}
                        </p>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              purchase.reference || "",
                              "reference",
                            )
                          }
                          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          {copiedField === "reference" ? (
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {purchase.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {purchase.notes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProductPurchaseDetailsModal;
