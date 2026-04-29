"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart, UserCheck, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { POSCartItemComponent } from "./PosCartItem";
import type { POSCartItem, OrderType } from "@/types/pos";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ScheduleOrder } from "../shared/ScheduleOrder";
import { useUser } from "@/context/UserContext";

interface POSCartSidebarProps {
  items: POSCartItem[];
  onItemQuantityChange: (productId: string, quantity: number) => void;
  onItemRemove: (productId: string) => void;
  schedule: {
    type: "INSTANT" | "SCHEDULED";
    scheduledAt?: string;
  };
  setSchedule: (val: {
    type: "INSTANT" | "SCHEDULED";
    scheduledAt?: string;
  }) => void;
  onCheckout: (
    customerData: CustomerData,
    orderType: OrderType,
    totalAmount: number,
    discountAmount: number,
    deliveryCharge: number,
  ) => void;
  isProcessing?: boolean;
}

export interface CustomerData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  zipCode?: string;
  notes?: string;
}

const DEFAULT_NOTES = `কাস্টমার পেমেন্ট ছাড়া পার্সেল খুলবেন না। খুললে ভিডিও বাধ্যতামূলক। ড্যামেজ বা প্রডাক্ট পরিবর্তন হলে দায় মার্চেন্ট নেবে না। রিটার্ন চেক করা হবে—সতর্ক থাকুন।`;

export function POSCartSidebar({
  items,
  onItemQuantityChange,
  onItemRemove,
  onCheckout,
  schedule,
  setSchedule,
  isProcessing = false,
}: POSCartSidebarProps) {
  const searchParams = useSearchParams();
 const {user} = useUser()
  const isModerator = user?.role === "MODERATOR";

  // Default to DELIVERY for moderators, PICKUP for others
  const [orderType, setOrderType] = React.useState<OrderType>(
    isModerator ? "DELIVERY" : "PICKUP",
  );
  const [isPrefilled, setIsPrefilled] = useState(false);
  const [discountInput, setDiscountInput] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);

  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    notes: DEFAULT_NOTES,
  });

  useEffect(() => {
    if (searchParams.get("prefill") === "1") {
      const name = searchParams.get("name") ?? "";
      const email = searchParams.get("email") ?? "";
      const phone = searchParams.get("phone") ?? "";
      const address = searchParams.get("address") ?? "";

      setTimeout(() => {
        setCustomerData((prev) => ({ ...prev, name, email, phone, address }));
        if (address) setOrderType("DELIVERY");
        setIsPrefilled(true);
      }, 100);

      toast.success("Customer details pre-filled from lead", {
        description: name ? `Welcome, ${name}` : undefined,
        duration: 3000,
      });
    }
  }, [searchParams]);

  const subtotal = items.reduce(
    (sum, item) =>
      sum + (item.product.discountPrice || item.product.price) * item.quantity,
    0,
  );
  const parsedDelivery = parseFloat(deliveryCharge || "0");
  const deliveryFee = !isNaN(parsedDelivery) ? parsedDelivery : 0;

  const rawDiscount = parseFloat(discountInput || "0");
  const discountAmount =
    !isNaN(rawDiscount) && rawDiscount >= 0 ? rawDiscount : 0;
  const discountCapped = Math.min(discountAmount, subtotal);

  const totalAmount = Math.max(0, subtotal + deliveryFee - discountCapped);

  const handleDiscountChange = (val: string) => {
    setDiscountInput(val);
    const num = parseFloat(val);
    if (val && (isNaN(num) || num < 0)) {
      setDiscountError("Enter a valid amount");
    } else if (!isNaN(num) && num > subtotal) {
      setDiscountError("Discount exceeds subtotal");
    } else {
      setDiscountError("");
    }
  };

  const clearDiscount = () => {
    setDiscountInput("");
    setDiscountError("");
  };

  const isFormValid =
    customerData.name.trim() &&
    customerData.email.trim() &&
    customerData.phone.trim() &&
    (orderType === "PICKUP" || customerData.address.trim());

  const handleCheckout = () => {
    if (isBlocked) {
      toast.error("This customer already placed order today");
      return;
    }

    if (isFormValid && items.length > 0 && !discountError) {
      onCheckout(
        customerData,
        orderType,
        totalAmount,
        discountCapped,
        deliveryFee,
      );
    }
  };

  useEffect(() => {
    if (!customerData.phone) return;

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URl}/order/check-phone?phone=${customerData.phone}`,
        );
        const data = await res.json();

        if (data.blocked) {
          setIsBlocked(true);
          toast.warning("Customer already ordered today");
        } else {
          setIsBlocked(false);
        }
      } catch {}
    }, 500);

    return () => clearTimeout(timeout);
  }, [customerData.phone]);

  const fieldCls =
    "text-sm rounded-lg border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50 focus:border-blue-400 dark:focus:border-blue-500 transition-colors";

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-gray-900 overflow-hidden">
      {/* ── PINNED: Header ── */}
      <div className="shrink-0 border-b border-gray-200 dark:border-gray-700 px-4 py-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-50">
              Order
              {items.length > 0 && (
                <span className="ml-1.5 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {items.length}
                </span>
              )}
            </h2>
          </div>
          {isPrefilled && (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 dark:bg-emerald-900/20">
              <UserCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                From Lead
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── SCROLLABLE middle ── */}
      <div className="flex-1 overflow-y-auto">
        {/* Cart items */}
        <div className="p-4 space-y-2.5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <ShoppingCart className="h-10 w-10 text-gray-300 dark:text-gray-700 mb-2" />
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Cart is empty
              </p>
            </div>
          ) : (
            items.map((item) => (
              <POSCartItemComponent
                key={item.product._id}
                item={item}
                onQuantityChange={(qty) =>
                  onItemQuantityChange(item.product._id as string, qty)
                }
                onRemove={() => onItemRemove(item.product._id as string)}
              />
            ))
          )}
        </div>

        {/* ── Summary ── */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/40 px-4 py-3 space-y-1.5">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Subtotal</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200 tabular-nums">
              ৳{subtotal.toFixed(2)}
            </span>
          </div>
          <div className="mt-3">
            <p className="mb-1 text-xs font-semibold text-gray-500">
              Delivery Charge
            </p>
            <Input
              type="number"
              min="0"
              step="1"
              placeholder="Enter delivery charge"
              value={deliveryCharge}
              onChange={(e) => setDeliveryCharge(e.target.value)}
              className="text-sm"
            />
          </div>
          {discountCapped > 0 && (
            <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400">
              <span className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                Discount
              </span>
              <span className="font-semibold tabular-nums">
                -৳{discountCapped.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-1.5 text-sm font-bold">
            <span className="text-gray-900 dark:text-gray-50">Total</span>
            <span className="text-blue-600 dark:text-blue-400 tabular-nums">
              ৳{totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* ── Discount input ── */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            <Tag className="h-3 w-3" />
            Discount
          </p>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-sm font-semibold text-gray-400 dark:text-gray-500 pointer-events-none select-none">
              ৳
            </span>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={discountInput}
              onChange={(e) => handleDiscountChange(e.target.value)}
              className={cn(
                "pl-7 pr-8 text-sm rounded-lg",
                "border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50",
                "focus:border-emerald-400 dark:focus:border-emerald-500 transition-colors",
                discountError && "border-red-400 dark:border-red-500",
              )}
            />
            {discountInput && (
              <button
                onClick={clearDiscount}
                className="absolute right-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Clear discount"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {discountError && (
            <p className="mt-1 text-[11px] font-medium text-red-500 dark:text-red-400">
              {discountError}
            </p>
          )}
          {discountCapped > 0 && !discountError && (
            <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
              ৳{discountCapped.toFixed(2)} discount applied
            </p>
          )}
        </div>

        {/* ── Order type ── */}
        {!isModerator && (
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Order Type
            </p>
            <div className="flex gap-2">
              {(["PICKUP", "DELIVERY"] as const).map((type) => {
                if (isModerator && type === "PICKUP") return null;

                return (
                  <button
                    key={type}
                    onClick={() => !isModerator && setOrderType(type)}
                    className={cn(
                      "flex-1 rounded-lg py-2 px-3 text-xs font-semibold transition-all duration-200",
                      orderType === type
                        ? "bg-blue-600 text-white shadow-sm dark:bg-blue-700"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
                      isModerator && "cursor-not-allowed opacity-80",
                    )}
                  >
                    {type === "PICKUP" ? "Pickup" : "Delivery"}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Customer details ── */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Customer Details
          </p>

          {isPrefilled && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 dark:border-emerald-800/60 dark:bg-emerald-900/20">
              <UserCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                Pre-filled from lead — review & confirm
              </p>
            </div>
          )}

          <Input
            placeholder="Full Name *"
            value={customerData.name}
            onChange={(e) =>
              setCustomerData({ ...customerData, name: e.target.value })
            }
            className={fieldCls}
          />
          <Input
            type="email"
            placeholder="Email *"
            value={customerData.email}
            onChange={(e) =>
              setCustomerData({ ...customerData, email: e.target.value })
            }
            className={fieldCls}
          />
          <Input
            type="tel"
            placeholder="Phone *"
            value={customerData.phone}
            onChange={(e) =>
              setCustomerData({ ...customerData, phone: e.target.value })
            }
            className={fieldCls}
          />

          {orderType === "DELIVERY" && (
            <>
              <Input
                placeholder="Address *"
                value={customerData.address}
                onChange={(e) =>
                  setCustomerData({ ...customerData, address: e.target.value })
                }
                className={fieldCls}
              />
              <Input
                placeholder="City (optional)"
                value={customerData.city}
                onChange={(e) =>
                  setCustomerData({ ...customerData, city: e.target.value })
                }
                className={fieldCls}
              />
              <Input
                placeholder="ZIP Code (optional)"
                value={customerData.zipCode}
                onChange={(e) =>
                  setCustomerData({ ...customerData, zipCode: e.target.value })
                }
                className={fieldCls}
              />
            </>
          )}

          <textarea
            placeholder="Order Notes"
            value={customerData.notes}
            onChange={(e) =>
              setCustomerData({ ...customerData, notes: e.target.value })
            }
            className={cn(
              "w-full rounded-lg border p-2.5 text-xs leading-relaxed resize-none",
              "border-gray-200 bg-gray-50/50 text-gray-700",
              "dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300",
              "focus:border-blue-400 dark:focus:border-blue-500 focus:outline-none transition-colors",
            )}
            rows={3}
          />
          <div className="h-2" />
        </div>
      </div>

      <ScheduleOrder value={schedule} onChange={setSchedule} />

      {/* ── PINNED: Checkout button ── */}
      <div className="shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
        <Button
          onClick={handleCheckout}
          disabled={
            items.length === 0 ||
            !isFormValid ||
            isProcessing ||
            !!discountError ||
            isBlocked
          }
          className={cn(
            "hover:cursor-pointer w-full rounded-xl py-5 text-sm font-bold transition-all duration-200",
            "bg-emerald-600 text-white hover:bg-emerald-700",
            "active:scale-[0.98]",
            "dark:bg-emerald-700 dark:hover:bg-emerald-600",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Processing…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Confirm & Place Order
              {totalAmount > 0 && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold tabular-nums">
                  ৳{totalAmount.toFixed(2)}
                </span>
              )}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
