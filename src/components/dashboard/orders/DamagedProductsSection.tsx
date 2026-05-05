/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import type { Order } from "@/types/orders";

interface DamagedProduct {
  orderId: string;
  customOrderId: string;
  productId: string;
  productTitle: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customerName: string;
  markedAt: string;
  notes?: string;
}

interface DamagedProductsSectionProps {
  orders: Order[];
  isLoading?: boolean;
}

export function DamagedProductsSection({
  orders,
  isLoading = false,
}: DamagedProductsSectionProps) {
  // Extract damaged products from orders with DAMAGE status
  const damagedProducts: DamagedProduct[] = orders
    .filter((order) => order.orderStatus === "DAMAGE")
    .flatMap((order) =>
      (order.items || []).map((item: any) => ({
        orderId: order._id,
        customOrderId: order.customOrderId || order._id?.slice(0, 10),
        productId: item.productId,
        productTitle: item.title || item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: (item.price || 0) * (item.quantity || 1),
        customerName: order.billingDetails?.fullName || "Unknown",
        markedAt: order.updatedAt || new Date().toISOString(),
        notes: order.damageNotes,
      })),
    );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (damagedProducts.length === 0) {
    return (
      <Card className="border-dashed">
        <div className="flex flex-col items-center justify-center rounded-lg py-12 px-4">
          <AlertCircle className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">
            No damaged products
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            All products are in good condition
          </p>
        </div>
      </Card>
    );
  }

  // Calculate stats
  const totalDamagedItems = damagedProducts.reduce(
    (sum, p) => sum + p.quantity,
    0,
  );
  const totalDamagedValue = damagedProducts.reduce(
    (sum, p) => sum + p.totalPrice,
    0,
  );

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border border-red-200/50 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-red-700 dark:text-red-400">
                Damaged Products
              </p>
              <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
                {damagedProducts.length}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>

        <Card className="border border-red-200/50 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-red-700 dark:text-red-400">
                Total Items
              </p>
              <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
                {totalDamagedItems}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border border-red-200/50 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-red-700 dark:text-red-400">
                Total Value
              </p>
              <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
                ৳{totalDamagedValue.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-red-50/60 hover:bg-red-50/60 dark:bg-red-900/10 dark:hover:bg-red-900/10 border-b border-red-100/80 dark:border-red-900/20">
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-red-700/70 dark:text-red-500/70">
                  Order ID
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-red-700/70 dark:text-red-500/70">
                  Customer
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-red-700/70 dark:text-red-500/70">
                  Product
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-red-700/70 dark:text-red-500/70 text-right">
                  Qty
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-red-700/70 dark:text-red-500/70 text-right">
                  Price
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-red-700/70 dark:text-red-500/70">
                  Date Marked
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {damagedProducts.map((product, idx) => (
                <TableRow
                  key={`${product.orderId}-${product.productId}-${idx}`}
                  className="hover:bg-red-50/30 dark:hover:bg-red-900/5"
                >
                  <TableCell className="font-mono text-xs font-semibold">
                    <Badge
                      variant="outline"
                      className="border-red-200 bg-red-50/50 text-red-700 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400"
                    >
                      {product.customOrderId}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {product.customerName}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm">
                    {product.productTitle}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {product.quantity}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ৳{product.totalPrice.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {format(new Date(product.markedAt), "MMM d, yyyy")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
