/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  getReturnStatusColor,
  getRefundStatusColor,
  getReturnStatusLabel,
  getRefundStatusLabel,
} from "@/lib/return-status-colors";
import Image from "next/image";

interface ReturnDetailsModalProps {
  open: boolean;
  returnItem: any;
  onOpenChange: (open: boolean) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const ReturnDetailsModal: React.FC<ReturnDetailsModalProps> = ({
  open,
  returnItem,
  onOpenChange,
}) => {
  if (!returnItem) {
    return null;
  }

  const totalQty =
    returnItem.returnedProducts?.reduce(
      (sum: number, p: any) => sum + (p.quantity || 0),
      0,
    ) || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* <div className="h-1 w-full bg-linear-to-r from-amber-500 via-orange-500 to-yellow-500" /> */}

        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Return Parcel Details
          </DialogTitle>
          <DialogDescription>
            Return ID: {returnItem._id?.slice(-8).toUpperCase()}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[70vh] pr-2">
          <div className="space-y-6 px-2 pb-6">
            {/* Return Info Section */}
            <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-slate-900/30">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Return Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Return Status
                  </p>
                  <Badge
                    variant="outline"
                    className={`mt-1 ${getReturnStatusColor(
                      returnItem.returnStatus,
                    )}`}
                  >
                    {getReturnStatusLabel(returnItem.returnStatus)}
                  </Badge>
                </div>

                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Refund Status
                  </p>
                  <Badge
                    variant="outline"
                    className={`mt-1 ${getRefundStatusColor(
                      returnItem.refundStatus,
                    )}`}
                  >
                    {getRefundStatusLabel(returnItem.refundStatus)}
                  </Badge>
                </div>

                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Return Type
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {returnItem.returnType}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Refund Amount
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                    ৳{(returnItem.refundAmount || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              {returnItem.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Notes
                    </p>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                      {returnItem.notes}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Order Info Section */}
            <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-slate-900/30">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Linked Order Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Order ID
                  </p>
                  <p className="mt-1 font-mono text-sm font-medium text-gray-900 dark:text-white">
                    {returnItem.order?._id?.slice(-8).toUpperCase()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Order Status
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {returnItem.order?.orderStatus || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Delivery Status
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {returnItem.order?.deliveryStatus.replace(/_/g, " ") ||
                      "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Info Section */}
            <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-slate-900/30">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Customer Information
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Name
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {returnItem.customerInfo?.name || "Unknown"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Phone
                  </p>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                    {returnItem.customerInfo?.phone || "N/A"}
                  </p>
                </div>

                {returnItem.customerInfo?.email && (
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Email
                    </p>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                      {returnItem.customerInfo.email}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Returned Products Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Returned Products ({totalQty})
              </h3>

              <div className="space-y-3">
                {returnItem.returnedProducts?.map(
                  (product: any, index: number) => (
                    <div
                      key={index}
                      className="flex gap-4 rounded-lg border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-slate-900/30"
                    >
                      {/* Product Image */}
                      {product.product?.images?.[0] && (
                        <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
                          <Image
                            src={product.product.images[0]}
                            alt={product.product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Product Details */}
                      <div className="flex-1 space-y-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {product.product?.title || "Unknown Product"}
                          </p>
                          {product.product?.sku && (
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              SKU: {product.product.sku}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Returned Qty
                            </p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {product.quantity}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Return Reason
                            </p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {product.reason}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Refund Amount
                            </p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              ৳
                              {(
                                (product.sellingPrice || 0) * product.quantity
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Restock Indicator */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          {product.shouldRestock && (
                            <Badge
                              variant="outline"
                              className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
                            >
                              ✓ Restocked {product.restockCount}x
                            </Badge>
                          )}

                          {product.isDamaged && (
                            <Badge
                              variant="outline"
                              className="border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-400"
                            >
                              ⚠ Damaged
                            </Badge>
                          )}
                        </div>

                        {product.notes && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 pt-2">
                            {product.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Audit Information */}
            <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-slate-900/30">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Audit Information
              </h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Created By
                  </p>
                  <p className="mt-1 font-medium text-gray-900 dark:text-white">
                    {returnItem.processedBy?.name || "Unknown"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Created Date
                  </p>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">
                    {formatDate(returnItem.createdAt)}
                  </p>
                </div>

                {returnItem.updatedAt && (
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Last Updated
                    </p>
                    <p className="mt-1 text-gray-700 dark:text-gray-300">
                      {formatDate(returnItem.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
