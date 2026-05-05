/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { Search, Filter, ShoppingCart, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { POSProductListCard } from "./PosProductListCard";
import { POSCartSidebar, type CustomerData } from "./PosCartSidebar";
import { useGetAllProductsQuery } from "@/redux/features/product/product.api";
import type { POSCartItem, OrderType } from "@/types/pos";
import { IProduct } from "@/types";
import { useCreateOrderMutation } from "@/lib/hooks";
import { useGetMeQuery } from "@/redux/features/user/user.api";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export default function POSManagement() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [cartItems, setCartItems] = useState<POSCartItem[]>([]);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [schedule, setSchedule] = useState<{
    type: "INSTANT" | "SCHEDULED" | "HOLD";
    scheduledAt?: string;
  }>({
    type: "INSTANT",
  });

  const { data: user } = useGetMeQuery(undefined);
  const router = useRouter();

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    refetch,
  } = useGetAllProductsQuery({ limit: 500 });
  const { data: categoriesData } = useGetAllCategoriesQuery({});

  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();

  const allProducts: IProduct[] = useMemo(
    () => productsData?.data || [],
    [productsData],
  );
  const categories = categoriesData?.data || [];
  const filteredProducts = useMemo(() => {
    let result = allProducts;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      );
    }

    // Filter by category title
    if (category.trim()) {
      result = result.filter(
        (p) =>
          (p.category as any)?.title?.toLowerCase() ===
            category.toLowerCase() ||
          (typeof p.category === "string" &&
            p.category === category.toLowerCase()),
      );
    }

    return result;
  }, [allProducts, searchTerm, category]);

  const totalCartItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const handleAddToCart = (product: IProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { product, quantity: 1, selectedExtras: [] }];
    });
    toast.success(`${product.title} added to cart!`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product._id !== productId),
    );
    toast.success("Item removed from cart");
  };

  const handleCheckout = async (
    customerData: CustomerData,
    orderType: OrderType,
    totalAmount: number,
    discountAmount: number,
    deliveryCharge: number,
  ) => {
    try {
      if (!user?.data) {
        toast.error("User not loaded");
        return;
      }

      // if (String(user.data.role) !== "ADMIN") {
      //   toast.error("Only seller can create POS order");
      //   return;
      // }

      // if (orderType === "DELIVERY" && deliveryCharge <= 0) {
      //   toast.error("Delivery charge required");
      //   return;
      // }

      if (schedule.type === "SCHEDULED" && !schedule.scheduledAt) {
        toast.error("Please select schedule date & time");
        return;
      }

      const res = await createOrder({
        orderType: "POS",
        paymentMethod: "COD",
        products: cartItems.map((item) => ({
          product: item.product._id ?? "",
          title: item.product?.title || "Unknown Product",
          quantity: item.quantity,
        })),
        scheduleType: schedule.type,
        scheduledAt:
          schedule.type === "SCHEDULED"
            ? new Date(schedule.scheduledAt ?? "")
            : undefined,
        total: totalAmount,
        discount: discountAmount ?? 0,
        shippingCost: orderType === "DELIVERY" ? deliveryCharge : 0,
        billingDetails: {
          fullName: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
        },
        note: customerData.notes ?? "",
        seller: user?.data?._id,
      }).unwrap();

      if (res) {
        if (schedule.type === "SCHEDULED") {
          toast.success(
            `Order scheduled for ${new Date(
              schedule.scheduledAt ?? "",
            ).toLocaleString()}`,
          );
        } else {
          if (user?.data?.role === "MODERATOR") {
            toast.success("Order created successfully!");
            router.push("/staff/dashboard/my-orders");
          } else {
            toast.success("Order created successfully!");
            router.push("/staff/dashboard/orders-management");
          }
        }

        setCartItems([]);
        refetch();
        setMobileCartOpen(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create order");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 md:p-6 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              POS System
            </h1>

            {/* Mobile cart button */}
            <Button
              variant="outline"
              size="sm"
              className="relative flex items-center gap-2 lg:hidden"
              onClick={() => setMobileCartOpen(true)}
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline text-sm font-medium">Cart</span>
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {totalCartItems > 99 ? "99+" : totalCartItems}
                </span>
              )}
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2/5 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>

            {/* Category filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="pl-9 pr-4 py-2 h-10 w-full text-sm rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="">All Categories</option>
                {categories
                  .filter((cat) => cat?.title !== "All Categories")
                  .map((cat) => (
                    <option key={cat?._id} value={cat?.title ?? ""}>
                      {cat?.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Active filter chip */}
          {(searchTerm || category) && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Showing {filteredProducts.length} of {allProducts.length}{" "}
                products
              </span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                  &quot;{searchTerm}&quot;
                  <button
                    onClick={() => setSearchTerm("")}
                    className="hover:text-blue-900"
                    aria-label="Clear search"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {category && (
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/20 dark:text-violet-400">
                  {category}
                  <button
                    onClick={() => setCategory("")}
                    className="hover:text-violet-900"
                    aria-label="Clear category"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6">
            {isLoadingProducts ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Loading products...
                  </p>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 gap-2">
                <Search className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  No products found
                </p>
                {(searchTerm || category) && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setCategory("");
                    }}
                    className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
                <ScrollArea className="max-h-[60vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProducts.map((product) => (
                  <POSProductListCard
                    key={product._id}
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                    isLoading={isCreatingOrder}
                  />
                ))}
              </div>
                <ScrollBar orientation="vertical" />
                </ScrollArea>
            )}
          </div>
        </div>
      </div>

      {/* ── Desktop Cart Sidebar ── */}
      <div className="hidden lg:flex w-96 shrink-0 border-l border-gray-200 dark:border-gray-700 overflow-hidden">
        <POSCartSidebar
          items={cartItems}
          onItemQuantityChange={handleUpdateQuantity}
          onItemRemove={handleRemoveFromCart}
          onCheckout={handleCheckout}
          schedule={schedule}
          setSchedule={setSchedule}
          isProcessing={isCreatingOrder}
        />
      </div>

      {/* ── Mobile overlay ── */}
      {mobileCartOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileCartOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Cart Drawer ── */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-sm flex flex-col bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
          mobileCartOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="Cart"
      >
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-3 shrink-0">
          <span className="text-sm font-bold text-gray-900 dark:text-gray-50">
            Your Cart
          </span>
          <button
            onClick={() => setMobileCartOpen(false)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close cart"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <POSCartSidebar
            items={cartItems}
            onItemQuantityChange={handleUpdateQuantity}
            onItemRemove={handleRemoveFromCart}
            schedule={schedule}
            setSchedule={setSchedule}
            onCheckout={handleCheckout}
            isProcessing={isCreatingOrder}
          />
        </div>
      </div>
    </div>
  );
}
