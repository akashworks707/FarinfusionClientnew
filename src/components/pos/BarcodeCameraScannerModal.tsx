/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Camera, X } from "lucide-react";
import { toast } from "sonner";

interface BarcodeCameraScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBarcodeScanned: (barcode: string) => void;
}

export function BarcodeCameraScannerModal({
  open,
  onOpenChange,
  onBarcodeScanned,
}: BarcodeCameraScannerModalProps) {
  const [error, setError] = useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (!open) return;

    let controls: { stop: () => void } | undefined;
    let isScanned = false;

    setError(null);

    const codeReader = new BrowserMultiFormatReader();

    const startScanner = async () => {
      try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();

        if (!devices.length) {
          setError("No camera found");
          return;
        }

        controls = await codeReader.decodeFromVideoDevice(
          devices[0].deviceId,
          videoRef.current!,
          (result) => {
            if (!result || isScanned) return;

            isScanned = true;

            const barcode = result.getText();

            toast.success("Barcode scanned");
            onBarcodeScanned(barcode);

            controls?.stop();
            onOpenChange(false);
          },
        );
      } catch (err: any) {
        setError(
          err?.name === "NotAllowedError"
            ? "Camera permission denied"
            : "Failed to start scanner",
        );
      }
    };

    startScanner();

    return () => {
      controls?.stop();
    };
  }, [open, onBarcodeScanned, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Scan Barcode
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/10">
              <X className="h-8 w-8 text-red-500" />
              <p className="text-center text-sm font-medium text-red-700 dark:text-red-400">
                {error}
              </p>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="h-64 w-full rounded-lg bg-black object-cover"
            />
          )}

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
            <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
              Point camera at barcode. Scanning starts automatically.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
