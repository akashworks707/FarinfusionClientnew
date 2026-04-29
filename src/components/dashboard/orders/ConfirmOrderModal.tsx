/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Order } from "@/types/orders";
import { CourierProvider } from "@/types/courier";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ConfirmOrderModalProps {
  open: boolean;
  order: Order | null;
  loading: boolean;
  error: string | null;
  onConfirm: (courierName: CourierProvider) => void;
  onOpenChange: (open: boolean) => void;
}

export function ConfirmOrderModal({
  open,
  order,
  loading,
  error,
  onConfirm,
  onOpenChange,
}: ConfirmOrderModalProps) {

  if (!order || !open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Order</DialogTitle>

          <DialogDescription>
            Confirm order {order?.customOrderId} for processing
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <ScrollArea className="max-h-[70vh] overflow-y-auto pr-4">
         <div className="space-y-4 py-4">
  {/* Order Summary */}
  <div className="space-y-2 rounded-lg bg-muted p-3">
    <p className="text-sm font-medium">Order Summary</p>

    <div className="grid gap-1 text-sm text-muted-foreground">
      <div className="flex justify-between">
        <span>Customer:</span>
        <span className="font-medium text-foreground">
          {order?.billingDetails?.fullName}
        </span>
      </div>

      <div className="flex justify-between">
        <span>Total:</span>
        <span className="font-medium text-foreground">
          ৳{order?.total?.toFixed(2)}
        </span>
      </div>
    </div>
  </div>

  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
    <p className="text-xs text-blue-900">
      After confirmation, you can assign courier from the order table.
    </p>
  </div>
</div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="hover:cursor-pointer hover:scale-105 transition-transform ease-in-out duration-500"
          >
            {"Cancel"}
          </Button>
          <Button
            onClick={() => onConfirm(order?._id as any)
            }
            disabled={loading}
            className="min-w-30 hover:cursor-pointer hover:scale-105 bg-amber-600 hover:bg-amber-700 transition-transform ease-in-out duration-500"
          >
            {loading ? <Spinner className="mr-2 h-4 w-4" /> : null}
            {loading
              ? "Processing..."
              : "Confirm Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
