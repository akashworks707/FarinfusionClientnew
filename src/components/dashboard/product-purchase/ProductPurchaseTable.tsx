"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Eye, MoreHorizontal, Trash2, Edit, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatusChangeDialog } from "./StatusChangeDialog";

interface Purchase {
  _id: string;
  product?: { title?: string };
  supplierName: string;
  supplierPhone?: string;
  quantity: number;
  buyingPrice: number;
  totalAmount: number;
  paymentStatus: string;
  purchaseStatus: string;
  invoiceNo?: string;
  purchaseDate: string;
}

interface ProductPurchaseTableProps {
  purchases: Purchase[];
  isLoading?: boolean;
  onView?: (purchase: Purchase) => void;
  onEdit?: (purchase: Purchase) => void;
  onDelete?: (purchase: Purchase) => void;
  onStatusChange?: (
    purchaseId: string,
    statusType: "purchase" | "payment",
    newStatus: string,
  ) => Promise<void>;
}

const getPurchaseStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING:
      "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700",
    ORDERED:
      "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700",
    SHIPPED:
      "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700",
    RECEIVED:
      "bg-cyan-100 dark:bg-cyan-900/20 text-cyan-800 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-700",
    COMPLETED:
      "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700",
    CANCELLED:
      "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700",
  };
  return colors[status] || colors.PENDING;
};

const getPaymentStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PAID: "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700",
    PARTIAL:
      "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 border border-orange-300 dark:border-orange-700",
    UNPAID:
      "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700",
  };
  return colors[status] || colors.UNPAID;
};

export const ProductPurchaseTable: React.FC<ProductPurchaseTableProps> = ({
  purchases,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [statusChangeDialog, setStatusChangeDialog] = useState<{
    open: boolean;
    purchaseId: string | null;
    currentStatus: string;
    statusType: "purchase" | "payment";
  }>({
    open: false,
    purchaseId: null,
    currentStatus: "",
    statusType: "purchase",
  });

  const handleStatusChangeClick = (
    purchaseId: string,
    currentStatus: string,
    statusType: "purchase" | "payment",
  ) => {
    setStatusChangeDialog({
      open: true,
      purchaseId,
      currentStatus,
      statusType,
    });
  };

  const handleStatusChangeConfirm = async (newStatus: string) => {
    if (statusChangeDialog.purchaseId && onStatusChange) {
      await onStatusChange(
        statusChangeDialog.purchaseId,
        statusChangeDialog.statusType,
        newStatus,
      );
    }
  };

  return (
    <>
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900/50">
        <ScrollArea className="w-full">
          <Table>
            <TableHeader className="bg-linear-to-r from-amber-50 to-amber-50/50 dark:from-amber-950/30 dark:to-amber-950/10">
              <TableRow className="border-b border-amber-200 dark:border-amber-900/30 hover:bg-transparent">
                <TableHead className="text-amber-900 dark:text-amber-100 font-bold">
                  Product
                </TableHead>
                <TableHead className="text-amber-900 dark:text-amber-100 font-bold">
                  Supplier
                </TableHead>
                <TableHead className="text-amber-900 dark:text-amber-100 font-bold text-right">
                  Quantity
                </TableHead>
                <TableHead className="text-amber-900 dark:text-amber-100 font-bold text-right">
                  Unit Price
                </TableHead>
                <TableHead className="text-amber-900 dark:text-amber-100 font-bold text-right">
                  Total Amount
                </TableHead>
                <TableHead className="text-amber-900 dark:text-amber-100 font-bold text-center">
                  Purchase Status
                </TableHead>
                <TableHead className="text-amber-900 dark:text-amber-100 font-bold text-center">
                  Payment Status
                </TableHead>
                <TableHead className="text-amber-900 dark:text-amber-100 font-bold text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Loading purchases...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : purchases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <svg
                        className="h-12 w-12 text-gray-300 dark:text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 7l-8-4m0 0L4 7m16 0v10l-8 4m0-4L4 7m0 10v0a2 2 0 002 2h12a2 2 0 002-2v0"
                        />
                      </svg>
                      <span className="text-gray-500 dark:text-gray-400">
                        No purchases found
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                purchases.map((purchase) => (
                  <TableRow
                    key={purchase._id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-amber-50/30 dark:hover:bg-amber-950/10 transition-colors"
                  >
                    <TableCell className="font-semibold text-gray-900 dark:text-white">
                      {purchase.product?.title || "N/A"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      <div>
                        <p className="font-medium">{purchase.supplierName}</p>
                        {purchase.supplierPhone && (
                          <p className="text-xs">{purchase.supplierPhone}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-gray-900 dark:text-white">
                      {purchase.quantity}
                    </TableCell>
                    <TableCell className="text-right text-gray-700 dark:text-gray-300">
                      ৳{(purchase.buyingPrice || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-gray-900 dark:text-white">
                      ৳{(purchase.totalAmount || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        onClick={() =>
                          handleStatusChangeClick(
                            purchase._id,
                            purchase.purchaseStatus,
                            "purchase",
                          )
                        }
                        className="inline-block hover:opacity-80 transition-opacity"
                        title="Click to change status"
                      >
                        <Badge
                          className={`${getPurchaseStatusColor(
                            purchase.purchaseStatus,
                          )} cursor-pointer`}
                        >
                          {purchase.purchaseStatus}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        onClick={() =>
                          handleStatusChangeClick(
                            purchase._id,
                            purchase.paymentStatus,
                            "payment",
                          )
                        }
                        className="inline-block hover:opacity-80 transition-opacity"
                        title="Click to change status"
                      >
                        <Badge
                          className={`${getPaymentStatusColor(
                            purchase.paymentStatus,
                          )} cursor-pointer`}
                        >
                          {purchase.paymentStatus}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-amber-100 dark:hover:bg-amber-900/20"
                          >
                            <MoreHorizontal className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-48">
                          {onView && (
                            <>
                              <DropdownMenuItem
                                onClick={() => onView(purchase)}
                                className="cursor-pointer gap-2"
                              >
                                <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <span>View Details</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-800" />
                            </>
                          )}

                          {onEdit && (
                            <DropdownMenuItem
                              onClick={() => onEdit(purchase)}
                              className="cursor-pointer gap-2"
                            >
                              <Edit className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                          )}

                          {onStatusChange && (
                            <>
                              <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-800" />
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChangeClick(
                                    purchase._id,
                                    purchase.purchaseStatus,
                                    "purchase",
                                  )
                                }
                                className="cursor-pointer gap-2"
                              >
                                <CheckCircle2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                                <span>Purchase Status</span>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChangeClick(
                                    purchase._id,
                                    purchase.paymentStatus,
                                    "payment",
                                  )
                                }
                                className="cursor-pointer gap-2"
                              >
                                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <span>Payment Status</span>
                              </DropdownMenuItem>
                            </>
                          )}

                          {onDelete && (
                            <>
                              <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-800" />
                              <DropdownMenuItem
                                onClick={() => onDelete(purchase)}
                                className="cursor-pointer gap-2 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Status Change Dialog */}
      <StatusChangeDialog
        open={statusChangeDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setStatusChangeDialog({
              open: false,
              purchaseId: null,
              currentStatus: "",
              statusType: "purchase",
            });
          }
        }}
        currentStatus={statusChangeDialog.currentStatus}
        statusType={statusChangeDialog.statusType}
        onConfirm={handleStatusChangeConfirm}
      />
    </>
  );
};
