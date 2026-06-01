import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function useGlobalBarcodeScanner() {
  const router = useRouter();
  const bufferRef = useRef("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (e.key === "Enter") {
        const barcode = bufferRef.current.trim();

        if (barcode) {
          console.log("SCANNED:", barcode);

          router.push(`/staff/dashboard/pos?barcode=${barcode}`);
        }

        bufferRef.current = "";
        return;
      }

      if (e.key.length === 1) {
        bufferRef.current += e.key;
      }

      timeoutRef.current = setTimeout(() => {
        bufferRef.current = "";
      }, 300);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);
}
