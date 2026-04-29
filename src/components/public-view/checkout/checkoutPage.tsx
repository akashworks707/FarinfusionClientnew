/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import { AlertCircleIcon, X } from "lucide-react";
import Image from "next/image";

import { CartBreadcrumb } from "../common/CartBreadCrumb";
import ReturnPolicy from "../common/ReturnPolicy";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { removeFromCart } from "@/redux/slices/CartSlice";
import { useApplyCouponMutation } from "@/redux/features/coupon/coupon.api";
import { useCreateOrderMutation } from "@/lib/hooks";
import { useGetMeQuery } from "@/redux/features/user/user.api";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  fullName: z.string().min(3),
  phone: z.string().min(11).max(14),
  email: z.string().email(),
  address: z.string().min(5),
});

type FormData = z.infer<typeof formSchema>;

export default function CheckoutPage() {
  const labelClass = "text-[16px]";
  const inputClass = "mt-2 text-[16px] py-5";
  const dispatch = useDispatch();
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const router = useRouter();

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
  const [appliedCoupon, setAppliedCoupon] = useState<string | null | undefined>(null);

  const [applyCoupon, { isLoading: isApplying }] = useApplyCouponMutation();

  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();
  // const subtotal = cartList.reduce(
  //   (total, item) => total + item.price * item.quantity,
  //   0,
  // );

  const cartTotal = useMemo(() => {
    return cartList.reduce((sum, item) => {
      return sum + (item.discountPrice || 0) * item.quantity;
    }, 0);
  }, [cartList]);

  const payableTotal = finalTotal || cartTotal;

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
      }
    } catch {
      setDiscount(0);
      setFinalTotal(0);
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setDiscount(0);
    setFinalTotal(0);
    setAppliedCoupon(null);
  };

  // 📝 Submit
  const onSubmitHandler = async (data: FormData) => {
    try {
      if (!user?.data) {
        toast.error("User not loaded");
        return;
      }

      if (cartList.length === 0) {
        toast.error("Cart is empty");
        return;
      }

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

        billingDetails: {
          fullName: data.fullName,
          email: data.email,
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

  return (
    <div className="min-h-screen bg-gray-50">
      <CartBreadcrumb />

      <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        {/* LEFT FORM */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Billing Details</h2>

            <form
              onSubmit={handleSubmit(onSubmitHandler)}
              className="space-y-4"
            >
              <div>
                <Label className={labelClass}>Full Name *</Label>
                <Input {...register("fullName")} className={inputClass} />
                {errors.fullName && (
                  <p className="text-red-500 text-sm">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <Label className={labelClass}>Phone *</Label>
                <Input {...register("phone")} className={inputClass} />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label className={labelClass}>Email *</Label>
                <Input {...register("email")} className={inputClass} />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label className={labelClass}>Address *</Label>
                <Input {...register("address")} className={inputClass} />
                {errors.address && (
                  <p className="text-red-500 text-sm">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/*/!* Payment *!/*/}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Payment Information</h2>

            <Alert className="bg-[#E0B252] border-yellow-300 mb-6">
              <div className="flex items-center gap-5 px-4">
                <AlertCircleIcon className="text-white" />
                <AlertDescription className="text-white text-lg">
                  Sorry, it seems that there are no available payment methods.
                  Please contact us if you require assistance or wish to make
                  alternate arrangements.
                </AlertDescription>
              </div>
            </Alert>

            <p className="text-lg text-gray-600 mb-6">
              Your personal data will be used to process your order, support
              your experience throughout this website, and for other purposes
              described in our{" "}
              <span className="cursor-pointer text-amber-300 font-bold">
                privacy policy
              </span>
              .
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* PRODUCT LIST */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="text-lg font-semibold mb-4">Your Order</h2>

            {cartList.length > 0 ? (
              cartList.map((item) => (
                <div key={item._id} className="flex gap-3 border-b py-3">
                  <button
                    className={
                      "cursor-pointer hover:text-red-500 transition-all duration-200"
                    }
                    onClick={() => dispatch(removeFromCart(item._id))}
                  >
                    <X />
                  </button>

                  <Image
                    src={item.images?.[0] || "/product.jpg"}
                    alt="product"
                    width={60}
                    height={60}
                    className="rounded"
                  />

                  <div className="flex-1">
                    <h3 className="text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div>৳ {(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Cart is empty</p>
            )}
          </div>

          {/* COUPON */}
          <div className="flex gap-2">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon"
              className="border px-3 py-2 w-full rounded"
            />

            <button
              onClick={handleApplyCoupon}
              disabled={isApplying}
              className="bg-amber-600 hover:cursor-pointer hover:scale-105 ease-in-out transition-transform transform duration-500 text-white px-4 rounded"
            >
              Apply
            </button>
          </div>

          {/* Applied Coupon */}
          {appliedCoupon && (
            <div className="flex justify-between text-green-600 text-sm">
              <span>Applied: {appliedCoupon}</span>
              <button onClick={handleRemoveCoupon}>Remove</button>
            </div>
          )}

          {/* SUMMARY */}
          <div className="bg-white rounded-lg shadow-sm p-5 space-y-2">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{cartTotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-৳{discount}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>৳{payableTotal}</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleSubmit(onSubmitHandler)}
              disabled={isCreatingOrder}
              className="w-full hover:cursor-pointer hover:scale-105 ease-in-out transition-transform transform duration-500 bg-yellow-500 hover:bg-yellow-600 text-white py-6"
            >
              {isCreatingOrder ? "Processing..." : "Place Order"}
            </Button>
          </div>

          <ReturnPolicy />
        </div>
      </div>
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg text-center">
            <h2 className="text-xl font-bold text-green-600 mb-2">
              🎉 Order Successful!
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              Your order has been placed successfully.
            </p>

            <div className="text-left space-y-2 text-sm bg-gray-50 p-3 rounded">
              <p>
                <strong>Order ID:</strong>{" "}
                {orderInfo?.customOrderId || orderInfo?._id}
              </p>
              <p>
                <strong>Name:</strong> {orderInfo?.billingDetails?.fullName}
              </p>
              <p>
                <strong>Total:</strong> ৳{orderInfo?.total}
              </p>
            </div>

            <Button
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/");
              }}
              className="mt-5 w-full hover:cursor-pointer hover:scale-105 ease-in-out transition-transform transform duration-500 bg-green-600 hover:bg-green-700 text-white"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
