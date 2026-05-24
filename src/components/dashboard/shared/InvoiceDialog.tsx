/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/invoice";
import { format } from "date-fns";
import { Download, FileText, Printer, CheckCircle2 } from "lucide-react";
import type { Order } from "@/types/orders";
import { toast } from "sonner";
import { InvoicePDF } from "./InvoicePdf";
import { generatePDFFileName, formatInvoiceNumber } from "@/lib/invoice";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import Image from "next/image";

interface InvoiceDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TERMS = [
  "প্রোডাক্ট হাতে পাওয়ার সময় কুরিয়ার ম্যানের সামনে পার্সেল পলি খোলার আগ থেকেই ভিডিও করুন। পার্সেল পলি খুলে প্রডাক্ট নষ্ট/সিল খুলে ফেললে সেই দায়ভার সম্পূর্ণ ক্রেতার।",
  "স্কিন কেয়ার প্রোডাক্টের ফলাফল ব্যক্তিভেদে ভিন্ন হতে পারে।",
  "ব্যবহৃত বা সিল খোলা প্রোডাক্ট / ড্যামেজ প্রডাক্ট রিটার্ন / এক্সচেঞ্জ গ্রহণযোগ্য নয়।",
  "সরাসরি রোদ ও অতিরিক্ত গরম স্থান থেকে দূরে সংরক্ষণ করুন।",
  "প্রোডাক্ট ব্যবহারের নির্দেশনা অনুসরণ করুন।",
];

export function InvoiceDialog({
  order,
  open,
  onOpenChange,
}: InvoiceDialogProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const deliveryCharge = order.shippingCost ?? 0;
  const discount = order.discount ?? 0;
  const grandTotal = order.total ?? 0;
  const productsSubtotal =
    order.products?.reduce(
      (sum: number, item: any) =>
        sum + Number(item.discountPrice > 0 ? item.discountPrice : item.price || 0) * Number(item.quantity || 1),
      0,
    ) ?? 0;

  const handlePrint = () => {
    if (!invoiceRef.current) {
      toast.error("Invoice content not found");
      return;
    }

    const printWindow = window.open("", "_blank", "width=1000,height=900");

    if (!printWindow) {
      toast.error("Please allow popups for printing");
      return;
    }

    const styles = Array.from(
      document.querySelectorAll("style, link[rel='stylesheet']"),
    )
      .map((node) => node.outerHTML)
      .join("");

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Invoice ${formatInvoiceNumber(order._id)}</title>
        ${styles}
        <style>
          body {
            margin: 0;
            padding: 24px;
            background: white;
          }

          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div id="print-root">
          ${invoiceRef.current.outerHTML}
        </div>

        <script>
          setTimeout(() => {
            window.print();
            window.close();
          }, 700);
        </script>
      </body>
    </html>
  `);

    printWindow.document.close();
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const pdfModule = await import("@react-pdf/renderer");
      const blob = await pdfModule.pdf(<InvoicePDF order={order} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = generatePDFFileName(order);
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Invoice PDF Error", error);
      toast.error("Failed to download invoice. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] p-0 rounded-xl overflow-hidden">
        <ScrollArea className="h-[92vh]">
          <DialogHeader className="sr-only">
            <DialogTitle>Invoice</DialogTitle>
          </DialogHeader>

          {/* ── Sticky toolbar ── */}
          <div className="sticky top-0 z-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-amber-100 dark:border-amber-900/40 px-3 py-3 print:hidden">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/30 shrink-0">
                  <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-base text-amber-900 dark:text-amber-300 truncate">
                    Invoice #{formatInvoiceNumber(order._id)}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {order.customOrderId ? `Order: ${order.customOrderId}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="gap-1.5 hover:cursor-pointer border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
                <Button
                  size="sm"
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="gap-1.5 hover:cursor-pointer bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 text-white shadow-md shadow-amber-200 dark:shadow-none"
                >
                  <Download className="h-4 w-4" />
                  {isDownloading ? "Downloading…" : "Download PDF"}
                </Button>
              </div>
            </div>
          </div>

          <div
            ref={invoiceRef}
            className="relative bg-white dark:bg-gray-900 px-4 pb-5 space-y-6"
          >
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-60">
              <Image
                src="/assets/Farin-Fusion-01.png"
                alt="watermark"
                width={1100}
                height={900}
                className="object-contain opacity-[0.15] h-400 w-500"
              />
            </div>

            {/* ── Gold top bar ── */}
            <div className="h-1.25 bg-linear-to-r from-amber-700 via-amber-500 to-amber-700 rounded-full" />

            {/* ── HEADER ── */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-5 border-b-2 border-amber-600 relative z-10">
              {/* Left: brand */}
              <div className="space-y-2">
                <Link href="/" aria-label="Farin Fusion">
                  <Image
                    src="/assets/Farin-Fusion-Logo.jpeg"
                    alt="Farin Fusion"
                    width={110}
                    height={44}
                    className="h-20 rounded-md w-auto object-cover"
                    priority
                  />
                </Link>
               
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5 leading-relaxed">
                  <p>Email: info@farinfusion.com</p>
                  <p>Phone: +8801805564602</p>
                  {/* <p>Website: www.farinfusion.com</p> */}
                  <p>Address: Dhaka, Bangladesh</p>
                </div>
              </div>

              {/* Right: invoice meta */}
              <div className="text-right space-y-2 w-full sm:w-auto">
                <h1 className="text-4xl sm:text-5xl font-black text-amber-700 dark:text-amber-400 tracking-widest">
                  INVOICE
                </h1>
                <div className="text-xs sm:text-sm space-y-1.5">
                  {[
                    // ["Invoice No", formatInvoiceNumber(order._id)],
                    [
                      "Order ID",
                      order.customOrderId || formatInvoiceNumber(order._id),
                    ],
                    [
                      "Date",
                      format(
                        new Date(order.createdAt || new Date()),
                        "dd MMM yyyy",
                      ),
                    ],
                    ["Payment", order.payment ? "PAID" : "PENDING"],
                  ].map(([lbl, val]) => (
                    <p key={lbl} className="text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">{lbl}:</span>{" "}
                      <span className="text-gray-900 dark:text-gray-100 font-bold">
                        {val}
                      </span>
                    </p>
                  ))}
                  {/* <Badge className="mt-1 text-xs bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                    {order.orderStatus || "PENDING"}
                  </Badge> */}
                </div>
              </div>
            </div>

            {/* ── BILLING / SHIPPING INFO ── */}
            <div className="grid sm:grid-cols-2 gap-4 relative z-50">
              {/* Bill To */}
              <div className="border border-amber-200 dark:border-amber-800/50 rounded-lg p-4 bg-amber-50/40 dark:bg-amber-900/10">
                <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-3 pb-2 border-b border-amber-100 dark:border-amber-800">
                  Bill To
                </h3>
                {[
                  ["Customer Name", order.billingDetails?.fullName],
                  ["Email", order.billingDetails?.email],
                  ["Phone", order.billingDetails?.phone],
                ].map(([lbl, val]) => (
                  <div key={lbl} className="mb-2.5">
                    <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {lbl}
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {val || "N/A"}
                    </p>
                  </div>
                ))}
              </div>

              {/* Ship To */}
              <div className="border border-amber-200 dark:border-amber-800/50 rounded-lg p-4 bg-amber-50/40 dark:bg-amber-900/10">
                <h3 className="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-3 pb-2 border-b border-amber-100 dark:border-amber-800">
                  Ship To
                </h3>
                {[
                  // ["Shipping Address", order.shippingAddress],
                  ["Shipping Address", order.billingDetails?.address],
                  [
                    "Delivery Method",
                    order.courierName || order.paymentMethod || "Standard",
                  ],
                  ["Delivery Status", order.deliveryStatus],
                ].map(([lbl, val]) => (
                  <div key={lbl} className="mb-2.5">
                    <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {lbl}
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {val || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── ITEMS TABLE ── */}
            <div className="relative z-50">
              {/* <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-3">
                Order Details
              </h3> */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-amber-50 dark:bg-amber-900/20">
                    <tr>
                      <th className="text-left p-3 font-bold text-amber-800 dark:text-amber-400 border-b-2 border-amber-600 text-xs uppercase tracking-wide">
                        Product
                      </th>
                      <th className="text-center p-3 font-bold text-amber-800 dark:text-amber-400 border-b-2 border-amber-600 text-xs uppercase tracking-wide">
                        Qty
                      </th>
                      <th className="text-right p-3 font-bold text-amber-800 dark:text-amber-400 border-b-2 border-amber-600 text-xs uppercase tracking-wide">
                        Unit Price
                      </th>
                      <th className="text-right p-3 font-bold text-amber-800 dark:text-amber-400 border-b-2 border-amber-600 text-xs uppercase tracking-wide">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products?.map((item: any, i: number) => {
                      const product =
                        typeof item.product === "object" ? item.product : {};
                      const lineTotal =
                        (item.price || 0) * (item.quantity || 1);

                      return (
                        <tr
                          key={i}
                          className={`border-b border-gray-100 dark:border-gray-800 ${
                            i % 2 === 1
                              ? "bg-amber-50/30 dark:bg-amber-900/10"
                              : "bg-white dark:bg-transparent"
                          }`}
                        >
                          <td className="p-3">
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {product.title || item.title || "N/A"}
                            </p>
                            {product.sku && (
                              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                                SKU: {product.sku}
                              </p>
                            )}
                          </td>
                          <td className="p-3 text-center text-gray-700 dark:text-gray-300">
                            {item.quantity}
                          </td>
                          <td className="p-3 text-right text-gray-900 dark:text-gray-100">
                            {formatCurrency(item.price || 0)}
                          </td>
                          <td className="p-3 text-right font-semibold text-gray-900 dark:text-gray-100">
                            {formatCurrency(lineTotal)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── TOTALS ── */}
            <div className="flex justify-between items-center gap-5 relative z-50">
              <div className="border border-amber-200 dark:border-amber-800/50 rounded-lg bg-amber-50/40 dark:bg-amber-900/10 p-4 relative z-10">
              <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-3">
                প্রোডাক্ট নির্দেশনা ও শর্তাবলী:
              </h3>
              <ul className="space-y-2.5">
                {TERMS.map((term, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-[8px] text-gray-700 dark:text-gray-300 leading-relaxed"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
            </div>
              <div className="w-full border border-amber-300 dark:border-amber-700/50 rounded-lg bg-amber-50/50 dark:bg-amber-900/10 p-4 space-y-2.5">
                {[
                  {
                    lbl: "Products Subtotal",
                    val: formatCurrency(productsSubtotal as any),
                    cls: "",
                  },
                ].map(({ lbl, val, cls }) => (
                  <div
                    key={lbl}
                    className={`flex justify-between text-sm ${cls}`}
                  >
                    <span className="text-gray-600 dark:text-gray-400">
                      {lbl}:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {val}
                    </span>
                  </div>
                ))}

                {discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Discount:</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Delivery Charge:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {deliveryCharge > 0
                      ? formatCurrency(deliveryCharge)
                      : "FREE"}
                  </span>
                </div>

                {(order.advanceDetails?.amount ?? 0) > 0 && (
                  <div className="flex justify-between text-sm text-blue-600 dark:text-blue-400 font-semibold">
                    <span>Advance Paid:</span>
                    <span>
                      -{formatCurrency(order.advanceDetails?.amount || 0)}
                    </span>
                  </div>
                )}

                <Separator className="bg-amber-300 dark:bg-amber-700" />

                <div className="flex justify-between items-center">
                  <span className="text-base font-black text-amber-800 dark:text-amber-300">
                    Total Amount:
                  </span>
                  <span className="text-lg font-black text-amber-700 dark:text-amber-300">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          

            {/* ── FOOTER ── */}
            <div className="pt-5 border-t-2 border-amber-600 text-center space-y-1.5 relative z-10">
              <p className="text-base font-bold text-amber-700 dark:text-amber-400">
                ধন্যবাদ ফারিন ফিউশনের সাথে থাকার জন্য!
              </p>
             
             
              <div className="flex items-center justify-center gap-3 pt-2">
                <Separator className="flex-1 max-w-20 bg-amber-200 dark:bg-amber-800" />
                {/* <span className="text-xs font-bold text-amber-700 dark:text-amber-400 tracking-wider">
                  Quality Products, Premium Service
                </span> */}
                <Separator className="flex-1 max-w-20 bg-amber-200 dark:bg-amber-800" />
              </div>
              <p className="text-xs italic text-gray-500 dark:text-gray-500">
                ফারিন ফিউশন পন্য নয়, সমাধান বিক্রি করে।
              </p>
            </div>

            {/* ── Gold bottom bar ── */}
            {/* <div className="h-1.25 bg-linear-to-r from-amber-700 via-amber-500 to-amber-700 rounded-full" /> */}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
