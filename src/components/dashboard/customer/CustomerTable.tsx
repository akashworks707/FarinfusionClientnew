/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  MoreHorizontal,
  Eye,
  Trash2,
  Copy,
  Check,
} from "lucide-react";

interface CustomerTableProps {
  customers: any[];
  isLoading: boolean;
  onView: (customer: any) => void;
  onDelete: (customer: any) => void;
}

export function CustomerTable({
  customers,
  isLoading,
  onView,
  onDelete,
}: CustomerTableProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900/50">
      <ScrollArea className="md:max-w-full max-w-md">
        <Table>
          <TableHeader className="sticky top-0 bg-linear-to-r from-amber-50 to-amber-50/50 dark:from-amber-950/30 dark:to-amber-950/10 z-10">
            <TableRow className="border-b border-amber-200 dark:border-amber-900/30 hover:bg-transparent">
              <TableHead className="text-amber-900 dark:text-amber-100 font-bold">
                Name
              </TableHead>
              <TableHead className="text-amber-900 dark:text-amber-100 font-bold">
                Contact
              </TableHead>
              <TableHead className="text-amber-900 dark:text-amber-100 font-bold text-center">
                Orders
              </TableHead>
              <TableHead className="text-amber-900 dark:text-amber-100 font-bold text-right">
                Total Spent
              </TableHead>
              <TableHead className="text-amber-900 dark:text-amber-100 font-bold">
                Orders
              </TableHead>
              <TableHead className="text-amber-900 dark:text-amber-100 font-bold">
                Last Order
              </TableHead>
              <TableHead className="text-amber-900 dark:text-amber-100 font-bold text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Loading customers...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3.914a.5.5 0 01-.5-.5V5.414a.5.5 0 01.5-.5h10.172a.5.5 0 01.5.5v15.086a.5.5 0 01-.5.5z"
                      />
                    </svg>
                    <span className="text-gray-500 dark:text-gray-400">
                      No customers found
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow
                  key={customer.phone}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-amber-50/30 dark:hover:bg-amber-950/10 transition-colors"
                >
                  {/* Name */}
                  <TableCell className="font-semibold text-gray-900 dark:text-white">
                    {customer.fullName || "N/A"}
                  </TableCell>

                  {/* Email */}
                  <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                    {customer.email || "N/A"}
                  </TableCell>

                  {/* Phone */}
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {customer.phone || "N/A"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Total Spent */}
                  <TableCell className="text-right">
                    <span className="font-bold text-amber-700 dark:text-amber-400">
                      {formatCurrency(customer.totalSpent || 0)}
                    </span>
                  </TableCell>

                  {/* Order Count */}
                  <TableCell>
                    <Badge className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-900/60 font-semibold">
                      {customer.totalOrders || 0}
                    </Badge>
                  </TableCell>

                  {/* Last Order Date */}
                  <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                    {customer.latestOrderDate
                      ? formatDate(customer.latestOrderDate)
                      : "Never"}
                  </TableCell>

                  {/* Actions */}
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

                      <DropdownMenuContent align="end" className="w-56">
                        {/* View Orders */}
                        <DropdownMenuItem
                          onClick={() => onView(customer)}
                          className="cursor-pointer gap-2"
                        >
                          <Eye className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          <span>View Details</span>
                        </DropdownMenuItem>

                        {/* Copy Order IDs */}
                        {customer.customOrderIds &&
                          customer.customOrderIds.length > 0 && (
                            <>
                              <div className="px-2 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Order IDs
                              </div>
                              {customer.customOrderIds.map((orderId: string) => (
                                <DropdownMenuItem
                                  key={orderId}
                                  onClick={() =>
                                    copyToClipboard(orderId, orderId)
                                  }
                                  className="cursor-pointer gap-2 pl-8"
                                >
                                  {copiedId === orderId ? (
                                    <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5 text-gray-400" />
                                  )}
                                  <span className="font-mono text-xs">
                                    {orderId}
                                  </span>
                                </DropdownMenuItem>
                              ))}
                            </>
                          )}

                        <div className="border-t border-gray-100 dark:border-gray-800" />

                        {/* Delete */}
                        <DropdownMenuItem
                          onClick={() => onDelete(customer)}
                          className="cursor-pointer gap-2 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Move to Trash</span>
                        </DropdownMenuItem>
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
  );
}