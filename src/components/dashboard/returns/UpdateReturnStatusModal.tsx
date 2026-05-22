"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

interface UpdateReturnStatusModalProps {
  open: boolean;
  data: {
    id: string;
    returnStatus?: string;
    refundStatus?: string;
  } | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (returnStatus?: string, refundStatus?: string) => void;
}

export const UpdateReturnStatusModal: React.FC<
  UpdateReturnStatusModalProps
> = ({ open, data, onOpenChange, onConfirm }) => {
  const [returnStatus, setReturnStatus] = useState<string>("");
  const [refundStatus, setRefundStatus] = useState<string>("");

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        setReturnStatus(data.returnStatus || "");
        setRefundStatus(data.refundStatus || "");
      }, 100);
    }
  }, [data, open]);

  const handleConfirm = () => {
    onConfirm(returnStatus || undefined, refundStatus || undefined);
  };

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {/* <div className="h-1 w-full bg-linear-to-r from-amber-500 to-orange-500" /> */}

        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
            Update Return Status
          </DialogTitle>
          <DialogDescription>
            Update the return and refund status for this parcel
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Alert */}
          <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-900/30 dark:bg-amber-900/10">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Updating the status will affect inventory and refund processing.
            </p>
          </div>

          {/* Return Status */}
          <div className="space-y-2">
            <Label htmlFor="returnStatus" className="text-sm font-semibold">
              Return Status
            </Label>
            <Select value={returnStatus} onValueChange={setReturnStatus}>
              <SelectTrigger id="returnStatus">
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Refund Status */}
          <div className="space-y-2">
            <Label htmlFor="refundStatus" className="text-sm font-semibold">
              Refund Status
            </Label>
            <Select value={refundStatus} onValueChange={setRefundStatus}>
              <SelectTrigger id="refundStatus">
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PROCESSED">Processed</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
                <SelectItem value="NOT_REQUIRED">Not Required</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="hover:cursor-pointer gap-2 bg-amber-600 hover:bg-amber-700 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Update Status
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
