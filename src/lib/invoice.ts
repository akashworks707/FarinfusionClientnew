/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from "date-fns";
import type { Order } from "@/types/orders";

// Brand Color: Amber (#B45309)
export const BRAND_COLOR = "#B45309"; 
export const BRAND_COLOR_LIGHT = "#F59E0B"; 
export const BRAND_COLOR_DARK = "#92400E"; 

export function generatePDFFileName(order: Order): string {
  const orderDate = format(new Date(order.createdAt), "yyyy-MM-dd");
  const orderNumber = order?.customOrderId || order._id.slice(0, 8).toUpperCase();
  return `FARIN-FUSION-INV-${orderNumber}-${orderDate}.pdf`;
}

export function formatInvoiceNumber(orderId: string): string {
  return orderId.slice(0, 8).toUpperCase();
}

export function calculateLineTotal(item: any): number {
  return item.lineTotal ?? (item.price || 0) * (item.quantity || 1);
}

export function calculateRegularTotal(item: any): number {
  return item.regularPrice
    ? item.regularPrice * item.quantity
    : calculateLineTotal(item);
}

export function formatCurrency(amount: number): string {
  return `BDT${amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function formatCurrencyForPDF(amount: number): string {
  return `BDT${amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function getPaymentStatusColor(status: string): {
  bg: string;
  text: string;
} {
  switch (status) {
    case "PAID":
      return { bg: "rgb(254, 243, 199)", text: "rgb(180, 83, 9)" }; 
    case "PENDING":
      return { bg: "rgb(254, 243, 199)", text: "rgb(142, 75, 16)" };
    case "FAILED":
      return { bg: "rgb(254, 226, 226)", text: "rgb(153, 27, 27)" };
    default:
      return { bg: "rgb(243, 244, 246)", text: "rgb(75, 85, 99)" };
  }
}

export function getOrderStatusColor(status: string): string {
  switch (status) {
    case "CONFIRMED":
      return "text-amber-600";
    case "PENDING":
      return "text-yellow-600";
    case "COMPLETED":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
}
