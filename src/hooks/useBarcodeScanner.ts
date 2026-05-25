"use client";

import { useEffect, useRef, useCallback } from "react";

interface BarcodeScannerOptions {
  onBarcodeScanned: (barcode: string) => void;
  timeout?: number; 
}

export function useBarcodeScanner({
  onBarcodeScanned,
  timeout = 100,
}: BarcodeScannerOptions) {
  const barcodeRef = useRef<string>("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isComposingRef = useRef(false);

  const handleBarcodeComplete = useCallback(() => {
    const barcode = barcodeRef.current.trim();
    if (barcode.length >= 6) {
      // Minimum barcode length to avoid false positives
      onBarcodeScanned(barcode);
    }
    barcodeRef.current = "";
  }, [onBarcodeScanned]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input field
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true"
      ) {
        return;
      }

      // Skip if IME composition is active
      if (isComposingRef.current) return;

      // Handle Enter key (typical end-of-barcode marker)
      if (e.key === "Enter") {
        e.preventDefault();
        handleBarcodeComplete();
        return;
      }

      // Collect barcode characters (printable ASCII)
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        barcodeRef.current += e.key;

        // Clear timeout and set new one
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          handleBarcodeComplete();
        }, timeout);
      }
    };

    const handleCompositionStart = () => {
      isComposingRef.current = true;
    };

    const handleCompositionEnd = () => {
      isComposingRef.current = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("compositionstart", handleCompositionStart);
    window.addEventListener("compositionend", handleCompositionEnd);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("compositionstart", handleCompositionStart);
      window.removeEventListener("compositionend", handleCompositionEnd);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [handleBarcodeComplete, timeout]);
}