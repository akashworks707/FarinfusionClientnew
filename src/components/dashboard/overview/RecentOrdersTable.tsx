
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Order {
  _id: string;
  customOrderId?: string;
  billingDetails?: {
    fullName?: string;
    phone?: string;
  };
  total?: number;
  orderStatus?: string;
  deliveryStatus?: string;
  createdAt?: string;
}

interface RecentOrdersTableProps {
  orders: Order[];
}

const statusColors: Record<string, { bg: string; text: string }> = {
  PENDING: {
    bg: "bg-yellow-100 dark:bg-yellow-900/40",
    text: "text-yellow-800 dark:text-yellow-300",
  },
  CONFIRMED: {
    bg: "bg-blue-100 dark:bg-blue-900/40",
    text: "text-blue-800 dark:text-blue-300",
  },
  COMPLETED: {
    bg: "bg-green-100 dark:bg-green-900/40",
    text: "text-green-800 dark:text-green-300",
  },
  CANCELLED: {
    bg: "bg-red-100 dark:bg-red-900/40",
    text: "text-red-800 dark:text-red-300",
  },
};

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  if (!orders || orders.length === 0) {
    return (
      <Card className="border-amber-200/40 bg-linear-to-br from-card via-card to-card/70 dark:border-amber-900/40 dark:from-card dark:via-card dark:to-card/50 p-6">
        <h3 className="mb-6 text-lg font-semibold text-foreground">
          Recent Orders
        </h3>
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-amber-200/40 bg-amber-50/30 py-12 dark:border-amber-900/30 dark:bg-amber-950/10">
          <ShoppingBag className="mb-3 h-10 w-10 text-amber-600/60 dark:text-amber-400/60" />
          <p className="text-foreground font-medium">No recent orders</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Orders will appear here as they are placed
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200/40 bg-linear-to-br from-card via-card to-card/70 dark:border-amber-900/40 dark:from-card dark:via-card dark:to-card/50 p-0 overflow-hidden">
      <ScrollArea className="w-full">
        <Table>
          <TableHeader className="bg-amber-50/50 dark:bg-amber-950/20">
            <TableRow className="border-b border-amber-200/30 hover:bg-transparent dark:border-amber-900/30">
              <TableHead className="font-semibold text-amber-900 dark:text-amber-200 whitespace-nowrap">
                Order ID
              </TableHead>
              <TableHead className="font-semibold text-amber-900 dark:text-amber-200 whitespace-nowrap">
                Customer
              </TableHead>
              <TableHead className="text-right font-semibold text-amber-900 dark:text-amber-200 whitespace-nowrap">
                Total
              </TableHead>
              <TableHead className="font-semibold text-amber-900 dark:text-amber-200 whitespace-nowrap">
                Status
              </TableHead>
              <TableHead className="font-semibold text-amber-900 dark:text-amber-200 whitespace-nowrap">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const statusColor =
                statusColors[order.orderStatus || "PENDING"] ||
                statusColors?.PENDING ||
                "PENDING";
              const createdDate = order.createdAt
                ? new Date(order.createdAt)
                : null;
              const orderDate = createdDate
                ? createdDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "N/A";
              const orderTime = createdDate
                ? createdDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "N/A";
              const timeAgo = createdDate
                ? formatDistanceToNow(createdDate, { addSuffix: true })
                : "N/A";

              return (
                <TableRow
                  key={order._id}
                  className="border-b border-amber-100/50 hover:bg-amber-50/40 dark:border-amber-900/20 dark:hover:bg-amber-950/20 transition-all duration-200"
                >
                  <TableCell className="font-mono text-sm font-semibold text-amber-900 dark:text-amber-300 whitespace-nowrap">
                    {order.customOrderId || order._id?.slice(0, 8)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground text-sm">
                        {order.billingDetails?.fullName || "N/A"}
                      </span>
                      <span className="text-xs text-muted-foreground truncate max-w-37.5">
                        {order.billingDetails?.phone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-amber-700 dark:text-amber-400 whitespace-nowrap">
                    ৳{order.total || "0.00"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge className={`${statusColor.bg} ${statusColor.text}`}>
                      {order.orderStatus || "PENDING"}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                        <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        {orderDate}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {orderTime}
                      </span>
                      <span className="text-[10px] text-muted-foreground italic">
                        {timeAgo}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <ScrollBar
          orientation="horizontal"
          className="bg-amber-200/30 dark:bg-amber-900/30"
        />
      </ScrollArea>
    </Card>
  );
}