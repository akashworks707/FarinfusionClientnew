/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  useGetAllOrdersQuery,
  useConfirmOrderMutation,
  useCompleteOrderMutation,
  useGetAllScheduledOrdersQuery,
} from "@/redux/features/orders/ordersApi";
import { useCreateCourierMutation } from "@/lib/hooks";
import { OrderStats } from "./OrderStats";
import { OrderFilters, type DateFilter } from "./OrderFilters";
import { OrderTable } from "./OrderTable";
import { ConfirmOrderModal } from "./ConfirmOrderModal";
import { CompleteOrderModal } from "./CompleteOrderModal";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { AssignCourierModal } from "./AssignCourierModal";
import type { Order, OrderStatus } from "@/types/orders";
import { toast } from "sonner";
import { ModernPagination } from "./ModernPagination";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ShoppingBag } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

// const LIMIT = 10;

export default function OrdersManagement() {
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    from: undefined,
    to: undefined,
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [confirmingOrder, setConfirmingOrder] = useState<Order | null>(null);
  const [completingOrder, setCompletingOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [courierModalOpen, setCourierModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [activeTab, setActiveTab] = useState<"instant" | "scheduled">(
    "instant",
  );

  const queryArgs = {
    page,
    limit,
    ...(searchTerm && { searchTerm: debouncedSearch }),
    ...(status && { orderStatus: status }),
    ...(dateFilter.from && {
      "createdAt[gte]": format(dateFilter.from, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    }),
    ...(dateFilter.to && {
      "createdAt[lte]": format(dateFilter.to, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    }),
  };

  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useGetAllOrdersQuery(queryArgs, { pollingInterval: 10000 });
  const { data: scheduledOrdersData, isLoading: isScheduledLoading } =
    useGetAllScheduledOrdersQuery(queryArgs, {
      skip: activeTab !== "scheduled",
    });

  // Stats — unfiltered
  // const { data: allOrdersData } = useGetAllOrdersQuery({
  //   page: 1,
  //   limit: 1000,
  // });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [confirmOrder, { isLoading: isConfirming, error: confirmError }] =
    useConfirmOrderMutation();
  const [completeOrder, { isLoading: isCompleting, error: completeError }] =
    useCompleteOrderMutation();
  const [createCourier] = useCreateCourierMutation();

  const handleStatusChange = (val: OrderStatus | "") => {
    setStatus(val);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setPage(1);
  };

  const handleDateChange = (date: DateFilter) => {
    setDateFilter(date);
    setPage(1);
  };

  const handleReset = () => {
    setSearchTerm("");
    setStatus("");
    setDateFilter({ from: undefined, to: undefined });
    setPage(1);
  };

  const handleConfirmClick = (order: Order) => {
    setConfirmingOrder(order);
    setConfirmModalOpen(true);
  };

  const handleViewClick = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleCompleteClick = (order: Order) => {
    setCompletingOrder(order);
    setCompleteModalOpen(true);
  };

  const handleOpenCourierModal = (order: Order) => {
    setSelectedOrder(order);
    setCourierModalOpen(true);
  };

  const handleCourierSubmit = async () => {
    if (!selectedOrder) return;
    try {
      await createCourier({ orderId: selectedOrder._id }).unwrap();
      toast.success("Courier assigned successfully");
      setCourierModalOpen(false);
      setSelectedOrder(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to assign courier");
    }
  };

  const handleConfirmOrder = async (orderId: string) => {
    if (!confirmingOrder) return;
    try {
      await confirmOrder({ _id: orderId, orderStatus: "CONFIRMED" }).unwrap();
      await refetch();
      toast.success("Order confirmed", {
        description: `Order ${confirmingOrder.customOrderId || confirmingOrder._id} has been confirmed.`,
      });
      setConfirmModalOpen(false);
      setConfirmingOrder(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to confirm order");
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    if (!completingOrder) return;
    try {
      await completeOrder({ _id: orderId, orderStatus: "COMPLETED" }).unwrap();
      await refetch();
      toast.success("Order completed", {
        description: `Order ${completingOrder.customOrderId || completingOrder._id?.slice(0, 10)} marked as completed.`,
      });
      setCompleteModalOpen(false);
      setCompletingOrder(null);
    } catch (err: any) {
      toast.error("Failed to complete order", {
        description: err?.data?.message || "Please try again.",
      });
    }
  };

  // const handlePageChange = (newPage: number) => {
  //   setPage(newPage);
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  // const handleItemsPerPageChange = (newLimit: number) => {
  //   setLimit(newLimit);
  //   setPage(1);
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  const orders =
    activeTab === "instant"
      ? (ordersData?.data as Order[]) || []
      : (scheduledOrdersData?.data as Order[]) || [];

  const isLoadingFinal =
    activeTab === "instant" ? isLoading : isScheduledLoading;
  const meta: any =
    activeTab === "instant" ? ordersData?.meta : scheduledOrdersData?.meta;
  const totalCount = meta?.total ?? 0;
  const totalPages = meta?.totalPage ?? Math.ceil(totalCount / limit);
  // const allOrders = (allOrdersData?.data as Order[]) || [];

  console.log(ordersData?.stats)

  return (
    <div className="min-h-screen space-y-6 bg-background p-4 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 md:text-3xl">
            Orders
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and track all customer orders and shipments
          </p>
        </div>
        <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
          <ShoppingBag className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
      </div>

      {/* Stats */}
      <OrderStats stats={(ordersData?.stats) as any}  />

      <OrderFilters
        statusFilter={status}
        searchFilter={searchTerm}
        dateFilter={dateFilter}
        onStatusChange={handleStatusChange}
        onSearchChange={handleSearchChange}
        onDateChange={handleDateChange}
        onReset={handleReset}
        totalResults={totalCount}
      />

      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
        {/* Tabs Header */}
        <TabsList className="bg-transparent">
          <div className="flex gap-2 border-gray-200 dark:border-gray-700 pb-2">
            <button
              onClick={() => {
                setActiveTab("instant");
                setPage(1);
              }}
              className={cn(
                "px-4 py-2 text-sm font-semibold rounded-md transition",
                activeTab === "instant"
                  ? "bg-amber-500 text-white"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white",
              )}
            >
              Instant Orders
            </button>

            <button
              onClick={() => {
                setActiveTab("scheduled");
                setPage(1);
              }}
              className={cn(
                "px-4 py-2 text-sm font-semibold rounded-md transition",
                activeTab === "scheduled"
                  ? "bg-blue-500 text-white"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white",
              )}
            >
              Scheduled Orders
            </button>
          </div>
        </TabsList>

        {/* Instant Orders */}
        <TabsContent value="instant">
          <OrderTable
            orders={(ordersData?.data as Order[]) || []}
            loading={isLoadingFinal}
            error={error ? "Failed to load orders" : null}
            onConfirmOrder={handleConfirmClick}
            refetch={refetch}
            onViewOrder={handleViewClick}
            onAssignCourier={handleOpenCourierModal}
            onCompleteOrder={handleCompleteClick}
          />
        </TabsContent>

        {/* Scheduled Orders */}
        <TabsContent value="scheduled">
          <OrderTable
            orders={(scheduledOrdersData?.data as Order[]) || []}
            loading={isScheduledLoading}
            error={null}
            onConfirmOrder={handleConfirmClick}
            refetch={refetch}
            onViewOrder={handleViewClick}
            onAssignCourier={handleOpenCourierModal}
            onCompleteOrder={handleCompleteClick}
          />
        </TabsContent>
      </Tabs>

      {/* Modern Pagination */}
      {totalCount > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && setPage(page - 1)}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer hover:text-amber-600"
                  }
                />
              </PaginationItem>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum: number;
                if (totalPages <= 5) pageNum = i + 1;
                else if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setPage(pageNum)}
                      isActive={page === pageNum}
                      className={cn(
                        "cursor-pointer",
                        page === pageNum &&
                          "border-amber-400 text-amber-700 bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:bg-amber-900/20",
                      )}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() => page < totalPages && setPage(page + 1)}
                  className={
                    page === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer hover:text-amber-600"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Modals */}
      <AssignCourierModal
        open={courierModalOpen}
        onClose={() => setCourierModalOpen(false)}
        onSubmit={handleCourierSubmit}
      />

      <ConfirmOrderModal
        open={confirmModalOpen}
        order={confirmingOrder}
        loading={isConfirming}
        error={
          confirmError ? "Failed to confirm order. Please try again." : null
        }
        onConfirm={handleConfirmOrder}
        onOpenChange={(open) => {
          setConfirmModalOpen(open);
          if (!open) setConfirmingOrder(null);
        }}
      />

      <CompleteOrderModal
        open={completeModalOpen}
        order={completingOrder}
        loading={isCompleting}
        error={
          completeError ? "Failed to complete order. Please try again." : null
        }
        onComplete={handleCompleteOrder}
        onOpenChange={(open) => {
          setCompleteModalOpen(open);
          if (!open) setCompletingOrder(null);
        }}
      />

      <OrderDetailsModal
        order={selectedOrder}
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open);
          if (!open) setSelectedOrder(null);
        }}
      />
    </div>
  );
}
