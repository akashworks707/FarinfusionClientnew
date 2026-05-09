"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";

interface ProductPurchaseToolbarProps {
  onSearchChange?: (term: string) => void;
  onStatusChange?: (status: string) => void;
  onPaymentStatusChange?: (status: string) => void;
  onReset?: () => void;
  onCreate?: () => void;
}

export const ProductPurchaseToolbar: React.FC<ProductPurchaseToolbarProps> = ({
  onSearchChange,
  onStatusChange,
  onPaymentStatusChange,
  onReset,
  onCreate,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearchChange?.(value);
  };

  const handleReset = () => {
    setSearchTerm("");
    onReset?.();
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-600" />
        <Input
          placeholder="Search by supplier name, phone, or invoice..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Purchase Status Filter */}
        <Select onValueChange={(value) => onStatusChange?.(value)}>
          <SelectTrigger className="bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <SelectValue placeholder="Purchase Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="ORDERED">Ordered</SelectItem>
            <SelectItem value="SHIPPED">Shipped</SelectItem>
            <SelectItem value="RECEIVED">Received</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        {/* Payment Status Filter */}
        <Select onValueChange={(value) => onPaymentStatusChange?.(value)}>
          <SelectTrigger className="bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="PARTIAL">Partial</SelectItem>
            <SelectItem value="UNPAID">Unpaid</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Button */}
        <Button
          onClick={handleReset}
          variant="outline"
          className="border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/20"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>

        {/* Create Button */}
        <Button
          onClick={() => onCreate?.()}
          className="bg-amber-600 dark:bg-amber-700 hover:bg-amber-700 dark:hover:bg-amber-800 text-white"
        >
          <span className="text-lg mr-2">+</span>
          Create Purchase
        </Button>
      </div>
    </div>
  );
};
