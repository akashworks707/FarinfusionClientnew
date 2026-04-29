/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SteadfastDeliveryInfo } from "./SteadfastDeliveryInfo";
import { useState } from "react";

export function AssignCourierModal({ open, onClose, onSubmit }: any) {
  const [selected, setSelected] = useState("STEADFAST");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Courier</DialogTitle>
        </DialogHeader>

        <SteadfastDeliveryInfo showDetails />

        <div className="mt-1">
          <Button
            onClick={() => onSubmit(selected)}
            className="min-w-30 hover:cursor-pointer hover:scale-105 bg-amber-600 hover:bg-amber-700 transition-transform ease-in-out duration-500"
          >
            Confirm Courier
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
