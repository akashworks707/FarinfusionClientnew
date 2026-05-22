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
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/invoice";
import { format } from "date-fns";
import { Download, FileText, Printer } from "lucide-react";
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

export function InvoiceDialog({
  order,
  open,
  onOpenChange,
}: InvoiceDialogProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const deliveryCharge = order.shippingCost ?? 0;
  const discount = order.discount ?? 0;
  const grandTotal = order.total || 0;

  const productsSubtotal: any = order.products?.reduce((sum, item) => {
    const price = item.price || item.discountPrice || 0;
    const quantity = item.quantity || 1;
    return sum + price * quantity;
  }, 0);

  const handlePrint = () => {
    if (!invoiceRef.current) {
      toast.error("Invoice content not found");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow pop-ups to print the invoice");
      return;
    }

    const printContent = invoiceRef.current.innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Farin Fusion Invoice - ${formatInvoiceNumber(order._id)}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            html, body {
              width: 100%;
              height: 100%;
            }

            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #1f2937;
              background: white;
            }

            @media print {
              body {
                margin: 0;
                padding: 0;
              }

              .print-container {
                margin: 0;
                padding: 20mm;
                page-break-after: always;
              }
            }

            .print-container {
              max-width: 210mm;
              margin: 0 auto;
              padding: 20mm;
              background: white;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
            }

            th, td {
              padding: 8px;
              text-align: left;
              border-bottom: 1px solid #d1d5db;
            }

            th {
              background-color: #fef3c7;
              font-weight: 600;
              color: #78350f;
              border-bottom: 2px solid #b45309;
            }

            .header-section {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 3px solid #b45309;
            }

            .invoice-title {
              font-size: 28px;
              font-weight: bold;
              color: #b45309;
            }

            .company-name {
              font-size: 16px;
              font-weight: bold;
              color: #b45309;
              margin-bottom: 4px;
            }

            .company-info {
              font-size: 12px;
              color: #666;
              line-height: 1.5;
            }

            .section-title {
              font-size: 12px;
              font-weight: bold;
              color: #b45309;
              margin: 15px 0 8px 0;
              border-bottom: 1px solid #fef3c7;
              padding-bottom: 6px;
            }

            .info-label {
              font-size: 11px;
              font-weight: 600;
              color: #666;
              margin-bottom: 2px;
            }

            .info-text {
              font-size: 12px;
              color: #1f2937;
              margin-bottom: 6px;
            }

            .totals-container {
              margin-top: 20px;
              text-align: right;
              margin-right: 20px;
            }

            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 6px;
              font-size: 13px;
            }

            .total-savings {
              color: #059669;
              font-weight: 600;
            }

            .total-amount {
              font-size: 16px;
              font-weight: bold;
              color: #78350f;
              margin-top: 10px;
              padding-top: 10px;
              border-top: 2px solid #b45309;
            }

            .footer {
              margin-top: 30px;
              padding-top: 15px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 11px;
              color: #666;
              line-height: 1.5;
            }

            .line-through {
              text-decoration: line-through;
              color: #999;
              font-size: 11px;
            }

            .badge: {
                marginTop: 8,
                paddingHorizontal: 6,
                paddingVertical: 3,
                backgroundColor: "#dcfce7",
                color: "#047857",
                borderRadius: 3,
                fontSize: 8,
                fontWeight: "bold",
                alignSelf: "flex-start",
                },
                            .twoColumn: {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                },

                .column: {
                width: "48%",
                },

            img {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${printContent}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);

    try {
      const pdfModule = await import("@react-pdf/renderer");
      const pdf = pdfModule.pdf;

      const blob = await pdf(<InvoicePDF order={order} />).toBlob();

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
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 rounded-xl border-gray-200/80 dark:border-gray-700/60">
        <ScrollArea className="h-[90vh]">
          <DialogHeader className="sr-only">
            <DialogTitle>Invoice</DialogTitle>
          </DialogHeader>

          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border p-4 print:hidden">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20 shrink-0">
                  <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="font-semibold text-lg truncate text-amber-900">
                  Invoice #{formatInvoiceNumber(order._id)}
                </h2>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="gap-2 hover:cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
                <Button
                  size="sm"
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="hover:cursor-pointer gap-2 bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 text-white"
                >
                  <Download className="h-4 w-4" />
                  {isDownloading ? "Downloading..." : "Download PDF"}
                </Button>
              </div>
            </div>
          </div>

          {/* Invoice Content */}
          <div
            ref={invoiceRef}
            className="bg-white dark:bg-gray-900 p-6 sm:p-8 md:p-12 space-y-6 md:space-y-8 print:p-8"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Link href="/" aria-label="Farin Fusion home">
                    <Image
                      src="/assets/FRN-Logo-scaled.webp"
                      alt="Farin Fusion"
                      width={120}
                      height={36}
                      className="h-10 w-auto object-contain"
                      priority
                    />
                  </Link>
                  <p className="text-sm text-gray-600 text-center dark:text-gray-400 font-medium">
                    Premium Quality Products
                  </p>
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>Email: info@farinfusion.com</p>
                  <p>Phone: +880-1-XXX-XXXXXX</p>
                  <p>Website: www.farinfusion.com</p>
                  <p>Address: Dhaka, Bangladesh</p>
                </div>
              </div>

              <div className="text-right space-y-3 w-full sm:w-auto">
                <h1 className="text-3xl sm:text-4xl font-bold text-amber-700 dark:text-amber-400">
                  INVOICE
                </h1>
                <div className="text-xs sm:text-sm space-y-2">
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Invoice No:</span>{" "}
                    {formatInvoiceNumber(order._id)}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Order ID:</span>{" "}
                    {order.customOrderId || formatInvoiceNumber(order._id)}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Date:</span>{" "}
                    {format(
                      new Date(order.createdAt || new Date()),
                      "MMM dd, yyyy",
                    )}
                  </p>
                  <Badge className="mt-2 inline-block text-xs bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200">
                    {order.orderStatus || "PENDING"}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="dark:bg-gray-700" />

            {/* Billing Info */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-amber-700 dark:text-amber-400 text-sm border-b border-amber-100 pb-2">
                  Bill To:
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Customer Name
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {order.billingDetails?.fullName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Email
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {order.billingDetails?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Phone
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {order.billingDetails?.phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-amber-700 dark:text-amber-400 text-sm border-b border-amber-100 pb-2">
                  Ship To:
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {order.shippingAddress || "N/A"}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {order.billingDetails?.address || "N/A"}
                  </p>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Delivery Method
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {order.courierName || "Standard"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="dark:bg-gray-700" />

            {/* Items Table */}
            <div>
              <h3 className="font-semibold text-amber-700 dark:text-amber-400 mb-4 text-sm">
                Order Details:
              </h3>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead className="bg-amber-50 dark:bg-amber-900/20">
                    <tr>
                      <th className="text-left p-3 font-semibold text-amber-900 dark:text-amber-400 border-b-2 border-amber-600">
                        Product
                      </th>
                      <th className="text-center p-3 font-semibold text-amber-900 dark:text-amber-400 border-b-2 border-amber-600">
                        Qty
                      </th>
                      <th className="text-right p-3 font-semibold text-amber-900 dark:text-amber-400 border-b-2 border-amber-600">
                        Unit Price
                      </th>
                      <th className="text-right p-3 font-semibold text-amber-900 dark:text-amber-400 border-b-2 border-amber-600">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products?.map((item: any, index: number) => {
                      const product =
                        typeof item.product === "object" ? item.product : {};
                      const lineTotal =
                        (item.price || 0) * (item.quantity || 1);

                      return (
                        <tr
                          key={index}
                          className={`${
                            index % 2 === 0
                              ? "bg-amber-50/30 dark:bg-amber-900/10"
                              : ""
                          } border-b border-gray-200 dark:border-gray-700`}
                        >
                          <td className="p-3">
                            <div className="space-y-1">
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {product.title || item.title || "N/A"}
                              </p>
                              {product.sku && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  SKU: {product.sku}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-center text-gray-700 dark:text-gray-300">
                            {item.quantity}
                          </td>
                          <td className="p-3 text-right text-gray-900 dark:text-gray-100">
                            {formatCurrency(item.price || 0)}
                          </td>
                          <td className="p-3 text-right font-medium text-gray-900 dark:text-gray-100">
                            {formatCurrency(lineTotal)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals Section */}
            <div className="flex justify-end">
              <div className="w-full sm:w-80 space-y-2 p-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-900/30">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">
                    Products Subtotal:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {productsSubtotal}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400 font-medium">
                    <span>Discount:</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">
                    Delivery Charge:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {deliveryCharge > 0
                      ? formatCurrency(deliveryCharge)
                      : "FREE"}
                  </span>
                </div>

                {order.advanceDetails?.amount > 0 && (
                  <div className="flex justify-between text-sm text-blue-600 font-medium">
                    <span>Advance Paid:</span>
                    <span>-{formatCurrency(order.advanceDetails.amount)}</span>
                  </div>
                )}

                <Separator className="my-2 dark:bg-gray-700" />

                <div className="flex justify-between text-base font-bold text-amber-900 dark:text-amber-400">
                  <span>Total Amount:</span>
                  <span className="text-lg text-amber-700 dark:text-amber-300">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <Separator className="dark:bg-gray-700" />

            <div className="text-center space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <p className="font-semibold text-amber-700 dark:text-amber-400">
                Payment Information
              </p>
              <p>Delivery Status: {order.deliveryStatus || "N/A"}</p>
              <p>Payment Status: {order.payment ? "PAID" : "PENDING"}</p>

              <Separator className="my-2 dark:bg-gray-700" />

              <p>Thank you for your purchase at Farin Fusion!</p>
              <p>For support, contact us at info@farinfusion.com</p>
              <p className="font-semibold text-amber-700 dark:text-amber-400">
                Quality Products, Premium Service
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
