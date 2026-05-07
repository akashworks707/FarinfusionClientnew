/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MoreHorizontal, Eye, Trash2, Copy, CheckCircle } from "lucide-react";

interface Customer {
  fullName: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  customOrderIds: string[];
  latestOrderDate?: string;
}

interface StaffCustomerTableProps {
  customers: any[];
  isLoading?: boolean;
  onView?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
}

export const StaffCustomerTable: React.FC<StaffCustomerTableProps> = ({
  customers,
  isLoading,
  onView,
  onDelete,
}) => {
  const [copiedPhone, setCopiedPhone] = React.useState<string | null>(null);

  const copyToClipboard = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  if (isLoading) {
    return (
      <Card className="border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Loading customers...
            </span>
          </div>
        </div>
      </Card>
    );
  }

  if (customers.length === 0) {
    return (
      <Card className="border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center justify-center py-12 gap-3">
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
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 dark:border-gray-700 p-0 overflow-hidden">
      <ScrollArea className="w-full md:max-w-full max-w-md">
        <Table>
          <TableHeader className="bg-linear-to-r from-amber-50 to-amber-50/50 dark:from-amber-950/30 dark:to-amber-950/10">
            <TableRow className="border-b border-amber-200 dark:border-amber-900/30 hover:bg-transparent">
              <TableHead className="text-amber-900 dark:text-amber-100 font-bold">
                Customer Name
              </TableHead>
              <TableHead className="text-amber-900 dark:text-amber-100 font-bold">
                Contact
              </TableHead>
              <TableHead className="text-amber-900 dark:text-amber-100 font-bold">
                Orders
              </TableHead>
              <TableHead className="text-amber-900 dark:text-amber-100 font-bold">
                Total Spent
              </TableHead>
              <TableHead className="text-amber-900 dark:text-amber-100 font-bold">
                Last Order
              </TableHead>
              <TableHead className="text-right text-amber-900 dark:text-amber-100 font-bold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {customers.map((customer) => (
              <TableRow
                key={customer.phone}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-amber-50/20 dark:hover:bg-amber-950/10 transition-colors"
              >
                <TableCell className="font-semibold text-gray-900 dark:text-white">
                  {customer.fullName}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {customer.email}
                    </p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {customer.phone}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200">
                    {customer.totalOrders}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-green-700 dark:text-green-300">
                    ৳{(customer.totalSpent || 0).toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                  {customer.latestOrderDate
                    ? new Date(customer.latestOrderDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )
                    : "N/A"}
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
                      <DropdownMenuItem
                        onClick={() => onView?.(customer)}
                        className="cursor-pointer gap-2"
                      >
                        <Eye className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <span>View Details</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => copyToClipboard(customer.phone)}
                        className="cursor-pointer gap-2"
                      >
                        {copiedPhone === customer.phone ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            <span>Copy Phone</span>
                          </>
                        )}
                      </DropdownMenuItem>

                      <div className="border-t border-gray-100 dark:border-gray-800 my-1" />

                      <DropdownMenuItem
                        onClick={() => onDelete?.(customer)}
                        className="cursor-pointer gap-2 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Remove</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Card>
  );
};
