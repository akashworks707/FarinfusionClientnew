/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import {
  X,
  MapPin,
  Truck,
  Building2,
  TreePine,
  CheckCircle2,
  Package,
  Phone,
  Clock,
  ShieldCheck,
  Facebook,
  ArrowRight,
  ShoppingBag,
  Wallet,
  Instagram,
} from "lucide-react";
import Image from "next/image";

import { CartBreadcrumb } from "../common/CartBreadCrumb";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { removeFromCart } from "@/redux/slices/CartSlice";
import { useApplyCouponMutation } from "@/redux/features/coupon/coupon.api";
import { useCreateOrderMutation } from "@/lib/hooks";
import { useGetMeQuery } from "@/redux/features/user/user.api";
import { useRouter } from "next/navigation";
import EmptyCartList from "../cart/EmptyCart";
import { cn } from "@/lib/utils";
import Link from "next/link";

type DeliveryAreaValue = "INSIDE_DHAKA" | "OUTSIDE_DHAKA" | "SAVAR_KERANIGANJ";

interface DeliveryAreaOption {
  value: DeliveryAreaValue;
  label: string;
  charge: number;
  icon: React.ElementType;
  description: string;
}

const DELIVERY_AREAS: DeliveryAreaOption[] = [
  {
    value: "INSIDE_DHAKA",
    label: "Inside Dhaka City",
    charge: 60,
    icon: Building2,
    description: "Delivery within Dhaka metro area",
  },
  {
    value: "OUTSIDE_DHAKA",
    label: "Outside Dhaka City",
    charge: 120,
    icon: Truck,
    description: "Delivery to other districts",
  },
  {
    value: "SAVAR_KERANIGANJ",
    label: "Savar / Keraniganj",
    charge: 80,
    icon: TreePine,
    description: "Delivery within Savar & Keraniganj",
  },
];

// ─── Form Schema — email removed from the visible form ───────────────────────

const formSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  phone: z.string().min(11, "Enter a valid phone number").max(14),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

type FormData = z.infer<typeof formSchema>;

// ─── Component ─────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const labelClass = "text-sm font-semibold text-gray-700 dark:text-gray-300";
  const inputClass =
    "mt-2 h-12 rounded-xl border-gray-200 text-[15px] focus-visible:ring-amber-400 dark:border-gray-700 transition-colors";

  const dispatch = useDispatch();
  const router = useRouter();

  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderInfo, setOrderInfo] = useState<any>(null);

  // Delivery area state — replaces old radio + editable input
  const [deliveryArea, setDeliveryArea] =
    useState<DeliveryAreaValue>("INSIDE_DHAKA");
  const selectedArea =
    DELIVERY_AREAS.find((a) => a.value === deliveryArea) ?? DELIVERY_AREAS[0];
  const deliveryCharge = selectedArea.charge; // ← always derived, never editable

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const cartList = useSelector((state: RootState) => state.cart.items);
  const { data: user } = useGetMeQuery(undefined);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null | undefined>(
    null,
  );

  const [applyCoupon, { isLoading: isApplying }] = useApplyCouponMutation();
  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();

  const cartTotal = useMemo(() => {
    return cartList.reduce((sum, item) => {
      const unitPrice =
        item?.discountPrice && item.discountPrice > 0
          ? item.discountPrice
          : item.price;
      return sum + unitPrice * item?.quantity;
    }, 0);
  }, [cartList]);

  const hasInvalidQty = cartList.some(
    (item) => item.quantity > item.availableStock,
  );

  const subtotal = finalTotal || cartTotal;
  // Grand Total = Subtotal − Discount + Shipping Charge
  const payableTotal = subtotal + Number(deliveryCharge || 0);

  // ─── Coupon handlers (unchanged logic) ──────────────────────────────────────

  const handleApplyCoupon = async () => {
    try {
      if (!couponCode.trim()) {
        toast.error("Enter coupon code");
        return;
      }

      const res = await applyCoupon({
        code: couponCode,
        total: cartTotal,
      }).unwrap();

      if (res) {
        setDiscount(res.data.discount);
        setFinalTotal(res.data.finalTotal);
        setAppliedCoupon(couponCode.toUpperCase());
        toast.success("Coupon applied successfully");
      }
    } catch {
      setDiscount(0);
      setFinalTotal(0);
      setAppliedCoupon(null);
      toast.error("Invalid or expired coupon");
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setDiscount(0);
    setFinalTotal(0);
    setAppliedCoupon(null);
  };

  // ─── Submit — email auto-generated for the payload only ─────────────────────

  const onSubmitHandler = async (data: FormData) => {
    try {
      // if (!user?.data) {
      //   toast.error("User not loaded");
      //   return;
      // }

      if (cartList.length === 0) {
        toast.error("Cart is empty");
        return;
      }

      // Backend still requires billingDetails.email — generate a stable
      // placeholder from the phone number so no UI field is needed.
      const userEmail = user?.data?.email;

      const res: any = await createOrder({
        orderType: "ONLINE",
        paymentMethod: "COD",

        products: cartList.map((item) => ({
          product: item._id,
          title: item.title,
          quantity: item.quantity,
        })),

        total: payableTotal,
        discount: discount || 0,
        shippingCost: deliveryCharge || 0,

        billingDetails: {
          fullName: data.fullName,
          email: userEmail || undefined,
          phone: data.phone,
          address: data.address,
        },

        couponCode: appliedCoupon || undefined,
      }).unwrap();

      if (res) {
        setOrderInfo(res?.data?.order);
        setShowSuccessModal(true);
        cartList.forEach((item) => dispatch(removeFromCart(item._id)));
        handleRemoveCoupon();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Checkout failed");
    }
  };

  if (!showSuccessModal && cartList.length === 0) {
    return <EmptyCartList />;
  }

  return (
    <div className="max-w-354 mx-auto min-h-screen bg-gray-50 dark:bg-gray-950">
      <CartBreadcrumb hasInvalidQty={hasInvalidQty} />

      <div className="container max-w-354 mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        {/* ══════════════════════ LEFT FORM ══════════════════════ */}
        <div className="lg:col-span-2 space-y-6">
          {/* Billing Details */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-50 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-amber-500" />
              Billing Details
            </h2>

            <form
              onSubmit={handleSubmit(onSubmitHandler)}
              className="space-y-5"
            >
              <div>
                <Label className={labelClass}>Full Name *</Label>
                <Input
                  {...register("fullName")}
                  placeholder="Your full name"
                  className={inputClass}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <Label className={labelClass}>Phone *</Label>
                <Input
                  {...register("phone")}
                  placeholder="01XXXXXXXXX"
                  className={inputClass}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <Label className={labelClass}>Full Address *</Label>
                <Input
                  {...register("address")}
                  placeholder="House, Road, Area and detailed address"
                  className={inputClass}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* ── Professional Delivery Area Section ── */}
              <div className="pt-2 space-y-3">
                <Label className={cn(labelClass, "flex items-center gap-2")}>
                  <MapPin className="h-4 w-4 text-amber-500" />
                  Your Delivery Area *
                </Label>

                <Select
                  value={deliveryArea}
                  onValueChange={(v) => setDeliveryArea(v as DeliveryAreaValue)}
                >
                  <SelectTrigger className="h-12 rounded-xl border-gray-200 dark:border-gray-700 text-[15px] focus:ring-amber-400">
                    <SelectValue placeholder="Select your delivery area" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {DELIVERY_AREAS.map((area) => {
                      const Icon = area.icon;
                      return (
                        <SelectItem
                          key={area.value}
                          value={area.value}
                          className="cursor-pointer py-2.5"
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="h-4 w-4 text-amber-500 shrink-0" />
                            <span className="font-medium">{area.label}</span>
                            <span className="ml-auto text-xs text-gray-400 tabular-nums">
                              ৳{area.charge}
                            </span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                {/* Selected area info card — animated on change */}
                <div
                  key={deliveryArea}
                  className="animate-in md:w-full w-60 fade-in slide-in-from-top-1 duration-300 flex lg:flex-wrap lg:flex-row flex-col lg:items-center gap-3 rounded-2xl border border-amber-200/60 bg-linear-to-br from-amber-50 to-orange-50/60 px-4 py-3.5 dark:border-amber-900/30 dark:from-amber-900/10 dark:to-orange-900/5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-gray-800">
                    <selectedArea.icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-50">
                      {selectedArea.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedArea.description}
                    </p>
                  </div>
                  <div className="shrink-0 rounded-full bg-amber-500 w-20 px-3 py-1.5 text-center shadow-sm">
                    <span className="text-sm font-bold text-white tabular-nums">
                      ৳{selectedArea.charge}
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Payment */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex gap-3 justify-between flex-wrap items-center">
              {" "}
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-50 flex items-center gap-2">
                <Wallet className="h-5 w-5 text-amber-500" />
                Payment Method
              </h2>
              <p className="font-semibold text-lg">Cash On Delivery (COD)</p>
            </div>

            {/* <Alert className="bg-amber-500 border-amber-400 mb-6 rounded-xl">
              <div className="flex items-center gap-4 px-2">
                <AlertCircleIcon className="text-white h-5 w-5 shrink-0" />
                <AlertDescription className="text-white text-sm leading-relaxed">
                  Cash on Delivery is currently the only available payment
                  method. Please contact us if you require assistance or wish to
                  make alternate arrangements.
                </AlertDescription>
              </div>
            </Alert> */}

            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Your personal data will be used to process your order, support
              your experience throughout this website, and for other purposes
              described in our{" "}
              {/* <Link href="/privacy-policy">
            <span className="cursor-pointer text-amber-600 dark:text-amber-400 font-semibold hover:underline">
                privacy policy
              </span>
              .
            </Link> */}
            </p>
          </div>
        </div>

        {/* ══════════════════════ RIGHT SIDE ══════════════════════ */}
        <div className="space-y-6">
          {/* Product list */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-50 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-amber-500" />
              Your Order
            </h2>

            {cartList.length > 0 ? (
              <div className="space-y-1">
                {cartList.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-3 flex-wrap border-b border-gray-100 dark:border-gray-800 py-3 last:border-0 group"
                  >
                    <button
                      className="text-gray-300 hover:text-red-500 transition-colors duration-200 shrink-0"
                      onClick={() => dispatch(removeFromCart(item._id))}
                      aria-label="Remove item"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-800">
                      <Image
                        src={item.images?.[0] || "/product.jpg"}
                        alt={item.title}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <div className="text-sm font-bold text-gray-900 dark:text-gray-50 tabular-nums shrink-0">
                      ৳
                      {(
                        (item?.discountPrice && item.discountPrice > 0
                          ? item.discountPrice
                          : item.price) * item.quantity
                      ).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Cart is empty</p>
            )}
          </div>

          {/* Coupon */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 space-y-3">
            <div className="flex gap-2">
              <Input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="h-11 rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-amber-400"
              />
              <Button
                onClick={handleApplyCoupon}
                disabled={isApplying}
                className="hover:cursor-pointer h-11 shrink-0 rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-5 transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-60"
              >
                {isApplying ? "Applying…" : "Apply"}
              </Button>
            </div>

            {appliedCoupon && (
              <div className="flex items-center justify-between rounded-xl bg-emerald-50 dark:bg-emerald-900/20 px-3.5 py-2.5 animate-in fade-in slide-in-from-top-1 duration-300">
                <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Applied: {appliedCoupon}
                </span>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-xs font-medium text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 transition-colors"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* ── Order Summary ── */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium text-gray-800 dark:text-gray-200">
                  ৳{cartTotal.toLocaleString()}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount</span>
                  <span className="tabular-nums font-medium">
                    -৳{discount.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Shipping — highlighted in brand color */}
              <div className="flex justify-between items-center rounded-lg bg-amber-50/60 dark:bg-amber-900/10 px-3 py-2 -mx-1">
                <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-medium">
                  <Truck className="h-3.5 w-3.5" />
                  Shipping Charge
                </span>
                <span className="tabular-nums font-bold text-amber-700 dark:text-amber-400">
                  ৳{deliveryCharge.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-3">
              <div className="flex justify-between items-baseline">
                <span className="text-base font-bold text-gray-900 dark:text-gray-50">
                  Grand Total
                </span>
                <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
                  ৳{payableTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleSubmit(onSubmitHandler)}
              disabled={isCreatingOrder}
              className="hover:cursor-pointer w-full h-13 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-base font-semibold py-6 transition-all duration-200 hover:scale-[1.01] active:scale-95 disabled:opacity-60 shadow-md hover:shadow-lg"
            >
              {isCreatingOrder ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Processing…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Place Order <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </div>

          {/* <ReturnPolicy /> */}
        </div>
      </div>

      <SuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        orderInfo={orderInfo}
        shippingCost={deliveryCharge}
        grandTotal={payableTotal}
        onContinueShopping={() => {
          setShowSuccessModal(false);
          router.push("/shop");
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Success Modal — separate component for clarity
// ═══════════════════════════════════════════════════════════════════════════

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderInfo: any;
  shippingCost: number;
  grandTotal: number;
  onContinueShopping: () => void;
}

function SuccessModal({
  open,
  onOpenChange,
  orderInfo,
  shippingCost,
  grandTotal,
  onContinueShopping,
}: SuccessModalProps) {
  const products = orderInfo?.products ?? [];
  const visibleProducts = products.slice(0, 3);
  const remainingCount = products.length - visibleProducts.length;

  const nextSteps = [
    {
      icon: Phone,
      text: "Our team will contact you shortly to confirm your order",
    },
    { icon: Clock, text: "Delivery within 1–3 working days" },
    {
      icon: ShieldCheck,
      text: "Keep your phone available for the courier call",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] max-w-md gap-0 p-0 overflow-hidden rounded-2xl border-0 sm:max-w-lg">
        {/* Success header with confetti-style dots */}
        <div className="relative overflow-hidden bg-linear-to-br from-emerald-500 via-emerald-500 to-teal-500 px-6 pt-8 pb-10 text-center">
          {/* Subtle confetti dots — pure Tailwind, no JS animation libs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {[...Array(14)].map((_, i) => (
              <span
                key={i}
                className={cn(
                  "absolute h-1.5 w-1.5 rounded-full bg-white/40 animate-in fade-in zoom-in",
                  i % 3 === 0 && "bg-amber-300/60",
                  i % 4 === 0 && "bg-white/70",
                )}
                style={{
                  left: `${(i * 37) % 100}%`,
                  top: `${(i * 23) % 100}%`,
                  animationDelay: `${i * 80}ms`,
                  animationDuration: "600ms",
                }}
              />
            ))}
          </div>

          <div className="relative animate-in zoom-in duration-500">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-4 ring-white/30">
              <CheckCircle2 className="h-9 w-9 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <h2 className="relative mt-4 text-xl font-bold text-white">
            Order Successful!{" "}
          </h2>
          <p className="relative mt-1 text-sm text-emerald-50">
            Thank you for shopping with Farin Fusion
          </p>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-5 space-y-5">
          {/* Order info card */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-800/40 space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Order ID</span>
              <span className="font-bold text-gray-900 dark:text-gray-50">
                {orderInfo?.customOrderId || orderInfo?._id}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Customer Name
              </span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {orderInfo?.billingDetails?.fullName}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Payment Method
              </span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                Cash on Delivery
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Shipping Charge
              </span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                ৳{shippingCost.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-baseline border-t border-dashed border-gray-200 dark:border-gray-700 pt-2.5">
              <span className="text-sm font-bold text-gray-900 dark:text-gray-50">
                Grand Total
              </span>
              <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
                ৳{(orderInfo?.total ?? grandTotal).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Purchased products */}
          {visibleProducts.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                <Package className="h-3 w-3" /> Items Purchased
              </p>
              <div className="space-y-1.5">
                {visibleProducts.map((p: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 rounded-lg bg-gray-50/60 px-3 py-2 dark:bg-gray-800/30"
                  >
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
                      {(p.product?.images?.[0] || p.images?.[0]) && (
                        <Image
                          src={p.product?.images?.[0] || p.images?.[0]}
                          alt={p.title || p.product?.title || "Product"}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <p className="flex-1 min-w-0 truncate text-xs font-medium text-gray-700 dark:text-gray-300">
                      {p.title || p.product?.title}
                    </p>
                    <span className="text-[11px] font-semibold text-gray-400 shrink-0">
                      x{p.quantity}
                    </span>
                  </div>
                ))}
                {remainingCount > 0 && (
                  <p className="text-center text-xs text-gray-400 pt-0.5">
                    +{remainingCount} more item{remainingCount !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* What's next */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              What&apos;s Next?
            </p>
            <div className="space-y-2">
              {nextSteps.map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-900/20">
                    <Icon className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed pt-0.5">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Social / contact */}
          <div className="flex items-center justify-center gap-3 pt-1">
            {[
              {
                icon: Facebook,
                label: "Facebook",
                href: "https://www.facebook.com/farinfusion",
              },
              {
                icon: Instagram,
                label: "Messenger",
                href: "https://www.instagram.com/reel/DQxO68fkbjd/?igsh=MXBzaTNmamZ1bmtqbA",
              },
              { icon: Phone, label: "WhatsApp", href: "https://wa.me" },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all duration-200 hover:scale-110 hover:bg-amber-100 hover:text-amber-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-amber-900/30 dark:hover:text-amber-400"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex flex-col gap-2 border-t border-gray-100 px-6 py-4 dark:border-gray-800 sm:flex-row">
          <Link href="/our-contacts">
            <Button
              variant="outline"
              className="hover:cursor-pointer flex-1 h-11 rounded-xl border-gray-200 dark:border-gray-700 transition-all duration-200 hover:scale-[1.02]"
            >
              Contact Support
            </Button>
          </Link>
          <Button
            onClick={onContinueShopping}
            className="hover:cursor-pointer flex-1 h-11 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-md"
          >
            Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
