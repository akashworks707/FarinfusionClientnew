// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import {
//   MoreHorizontal,
//   Eye,
//   CheckCircle,
//   Truck,
//   CheckCircle2,
//   UserCog,
//   User,
//   PencilLine,
// } from "lucide-react";
// import type { Order } from "@/types/orders";
// import { Courier } from "@/types/courier";
// import { cn } from "@/lib/utils";
// import {
//   useGetAllUsersQuery,
//   useGetMeQuery,
// } from "@/redux/features/user/user.api";
// import { toast } from "sonner";
// import { EditOrderModal } from "./EditOrderModal";
// import { useUpdateSellerMutation } from "@/redux/features/orders/ordersApi";

// interface OrderRowActionsProps {
//   order: Order;
//   courier?: Courier | null;
//   refetch: () => void;
//   onConfirm?: (order: Order) => void;
//   onView?: (order: Order) => void;
//   onAssignCourier?: (order: Order) => void;
//   onComplete?: (order: Order) => void;
// }

// export function OrderRowActions({
//   order,
//   courier,
//   refetch,
//   onConfirm,
//   onView,
//   onAssignCourier,
//   onComplete,
// }: OrderRowActionsProps) {
//   const isPending = order.orderStatus === "PENDING";
//   const isConfirmed = order.orderStatus === "CONFIRMED";
//   const isCompleted = order.orderStatus === "COMPLETED";
//   const isDelivered = courier?.deliveryStatus === "DELIVERED";
//   const canComplete = isConfirmed && isDelivered && !isCompleted;
//   const { data } = useGetMeQuery(undefined);
//   const userRole = data?.data?.role;
//   const canEdit =
//     userRole &&
//     ["ADMIN", "MODERATOR", "MANAGER", "TELLICELSS"].includes(userRole) &&
//     !order?.courierName;

//   const hasAccess =
//     userRole && ["ADMIN", "MANAGER", "TELLICELSS"].includes(userRole);

//   const withoutTellicelss =
//     userRole && ["ADMIN", "MANAGER"].includes(userRole);

//   const [editOpen, setEditOpen] = useState(false);

//   const [sellerDialogOpen, setSellerDialogOpen] = useState(false);
//   const [selectedSellerId, setSelectedSellerId] = useState<string>(
//     (order.seller as any)?._id ?? order.seller ?? "",
//   );
//   const [isSaving, setIsSaving] = useState(false);
//   const limit = 150;
//   const { data: users } = useGetAllUsersQuery({limit});
//   const [updateSeller] = useUpdateSellerMutation();

//   const sellerOptions = users?.data ?? [];

//   const currentSellerName =
//     (order.seller as any)?.name ??
//     sellerOptions.find((u) => u._id === order.seller)?.name ??
//     null;

//   const handleSaveSeller = async () => {
//     if (!selectedSellerId) return;
//     setIsSaving(true);
//     try {
//       await updateSeller({
//         _id: order._id,
//         data: {seller: selectedSellerId},
//       }).unwrap();
//       toast.success("Seller assigned successfully");
//       refetch();
//       setSellerDialogOpen(false);
//     } catch {
//       toast.error("Failed to assign seller");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="h-7 w-7 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
//           >
//             <MoreHorizontal className="h-4 w-4" />
//             <span className="sr-only">Order actions</span>
//           </Button>
//         </DropdownMenuTrigger>

//         <DropdownMenuContent align="end" className="w-52 rounded-xl">
//           {/* View */}
//           {onView && (
//             <DropdownMenuItem
//               className="gap-2 text-sm cursor-pointer"
//               onClick={() => onView(order)}
//             >
//               <Eye className="h-3.5 w-3.5 text-gray-500" />
//               View Details
//             </DropdownMenuItem>
//           )}

//           {/* Edit */}
//           {canEdit && (
//             <DropdownMenuItem
//               className="gap-2 text-sm cursor-pointer text-blue-600 focus:text-blue-600 dark:text-blue-400"
//               onClick={() => setEditOpen(true)}
//             >
//               <PencilLine className="h-3.5 w-3.5" />
//               Edit Order
//             </DropdownMenuItem>
//           )}

//           {/* Assign Seller */}
//           {order.isPublished && withoutTellicelss && (
//             <>
//               <DropdownMenuItem
//                 className="gap-2 text-sm cursor-pointer"
//                 onClick={() => setSellerDialogOpen(true)}
//               >
//                 <UserCog className="h-3.5 w-3.5 text-gray-500" />
//                 <span className="flex-1">Assign Seller</span>
//                 {currentSellerName && (
//                   <span className="truncate max-w-20 text-[10px] text-gray-400 dark:text-gray-500">
//                     {currentSellerName}
//                   </span>
//                 )}
//               </DropdownMenuItem>
//             </>
//           )}

//           {/* Confirm */}
//           {order.isPublished && hasAccess && isPending && onConfirm && (
//             <>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem
//                 className="gap-2 text-sm cursor-pointer text-emerald-600 focus:text-emerald-600 dark:text-emerald-400"
//                 onClick={() => onConfirm(order)}
//               >
//                 <CheckCircle className="h-3.5 w-3.5" />
//                 Confirm Order
//               </DropdownMenuItem>
//             </>
//           )}

//           {/* Assign Courier */}
//           {order.isPublished && hasAccess && isConfirmed && !courier && onAssignCourier && (
//             <>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem
//                 className="gap-2 text-sm cursor-pointer text-blue-600 focus:text-blue-600 dark:text-blue-400"
//                 onClick={() => onAssignCourier(order)}
//               >
//                 <Truck className="h-3.5 w-3.5" />
//                 Assign Courier
//               </DropdownMenuItem>
//             </>
//           )}

//           {/* Mark as Completed */}
//           {order.isPublished && hasAccess && canComplete && onComplete && (
//             <>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem
//                 className={cn(
//                   "gap-2 text-sm font-semibold cursor-pointer",
//                   "text-violet-600 focus:text-violet-600 dark:text-violet-400",
//                 )}
//                 onClick={() => onComplete(order)}
//               >
//                 <CheckCircle2 className="h-3.5 w-3.5" />
//                 Mark as Completed
//               </DropdownMenuItem>
//             </>
//           )}

//           {/* Already completed */}
//           {isCompleted && (
//             <>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem
//                 disabled
//                 className="gap-2 text-sm text-gray-400 cursor-default"
//               >
//                 <CheckCircle2 className="h-3.5 w-3.5" />
//                 Order Completed
//               </DropdownMenuItem>
//             </>
//           )}
//         </DropdownMenuContent>
//       </DropdownMenu>

//       {/* ── Edit Order Modal ── */}
//       <EditOrderModal
//         open={editOpen}
//         order={order}
//         onOpenChange={setEditOpen}
//         onSuccess={refetch}
//       />

//       {/* ── Assign Seller Dialog ── */}
//       <Dialog open={sellerDialogOpen} onOpenChange={setSellerDialogOpen}>
//         <DialogContent className="sm:max-w-95 gap-0 p-0 overflow-hidden rounded-2xl border-gray-200/80 dark:border-gray-700/60">
//           <div className="h-1 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-violet-500" />

//           <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
//             <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20">
//               <UserCog className="h-4 w-4 text-blue-600 dark:text-blue-400" />
//             </div>
//             <div>
//               <DialogTitle className="text-base font-bold text-gray-900 dark:text-gray-50">
//                 Assign Seller
//               </DialogTitle>
//               <DialogDescription className="text-xs text-gray-400 dark:text-gray-500">
//                 Order {order.customOrderId || order._id?.slice(0, 10)}
//               </DialogDescription>
//             </div>
//           </div>

//           <div className="px-5 py-5 space-y-3">
//             {currentSellerName && (
//               <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2 dark:border-blue-800/40 dark:bg-blue-900/10">
//                 <User className="h-3.5 w-3.5 shrink-0 text-blue-500" />
//                 <p className="text-xs text-blue-700 dark:text-blue-400">
//                   Currently:{" "}
//                   <span className="font-semibold">{currentSellerName}</span>
//                 </p>
//               </div>
//             )}

//             <div className="space-y-1.5">
//               <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
//                 Select staff member
//               </p>
//               <Select
//                 value={selectedSellerId}
//                 onValueChange={setSelectedSellerId}
//               >
//                 <SelectTrigger className="h-10 w-full rounded-lg border-gray-200 bg-gray-50/60 text-sm dark:border-gray-700 dark:bg-gray-800/60">
//                   <SelectValue placeholder="Choose a seller…" />
//                 </SelectTrigger>
//                 <SelectContent className="rounded-xl">
//                   {sellerOptions.length === 0 ? (
//                     <div className="py-6 text-center text-xs text-gray-400">
//                       No staff users found
//                     </div>
//                   ) : (
//                     sellerOptions.map((u) => (
//                       <SelectItem
//                         key={u._id}
//                         value={u._id}
//                         className="cursor-pointer text-sm"
//                       >
//                         <div className="flex items-center gap-2">
//                           <div
//                             className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
//                             style={{
//                               background: `hsl(${
//                                 [...u.name].reduce(
//                                   (a, c) => a + c.charCodeAt(0),
//                                   0,
//                                 ) % 360
//                               },52%,50%)`,
//                             }}
//                           >
//                             {u.name?.[0]?.toUpperCase() ?? "?"}
//                           </div>
//                           <span>{u.name}</span>
//                           <span className="text-[10px] text-gray-400">
//                             ({u.role})
//                           </span>
//                         </div>
//                       </SelectItem>
//                     ))
//                   )}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <DialogFooter className="flex gap-2 border-t border-gray-100 px-5 py-4 dark:border-gray-800">
//             <Button
//               variant="outline"
//               size="sm"
//               className="rounded-lg"
//               onClick={() => setSellerDialogOpen(false)}
//               disabled={isSaving}
//             >
//               Cancel
//             </Button>
//             <button
//               onClick={handleSaveSeller}
//               disabled={!selectedSellerId || isSaving}
//               className={cn(
//                 "group relative overflow-hidden inline-flex items-center gap-1.5",
//                 "rounded-lg px-4 py-2 text-sm font-semibold text-white",
//                 "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600",
//                 "transition-all duration-200 active:scale-95",
//                 "disabled:opacity-50 disabled:cursor-not-allowed",
//               )}
//             >
//               <span
//                 aria-hidden
//                 className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[200%]"
//               />
//               {isSaving ? (
//                 <span className="flex items-center gap-2">
//                   <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
//                   Saving…
//                 </span>
//               ) : (
//                 "Assign"
//               )}
//             </button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }







/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Eye,
  CheckCircle,
  Truck,
  CheckCircle2,
  UserCog,
  User,
  PencilLine,
} from "lucide-react";
import type { Order } from "@/types/orders";
import { Courier } from "@/types/courier";
import { cn } from "@/lib/utils";
import {
  useGetAllUsersQuery,
  useGetMeQuery,
} from "@/redux/features/user/user.api";
import { toast } from "sonner";
import { EditOrderModal } from "./EditOrderModal";
import { useUpdateSellerMutation } from "@/redux/features/orders/ordersApi";

interface OrderRowActionsProps {
  order: Order;
  courier?: Courier | null;
  refetch: () => void;
  onConfirm?: (order: Order) => void;
  onView?: (order: Order) => void;
  onAssignCourier?: (order: Order) => void;
  onComplete?: (order: Order) => void;
}

export function OrderRowActions({
  order,
  courier,
  refetch,
  onConfirm,
  onView,
  onAssignCourier,
  onComplete,
}: OrderRowActionsProps) {
  const isPending = order.orderStatus === "PENDING";
  const isConfirmed = order.orderStatus === "CONFIRMED";
  const isCompleted = order.orderStatus === "COMPLETED";
  const isDelivered = courier?.deliveryStatus === "DELIVERED";
  const canComplete = isConfirmed && isDelivered && !isCompleted;
  const { data } = useGetMeQuery(undefined);
  const userRole = data?.data?.role;

  const isAdmin = userRole === "ADMIN";
  const hasCourier = !!courier;

  // const canEdit =
  //   userRole &&
  //   ["ADMIN", "MODERATOR", "MANAGER", "TELLICELSS"].includes(userRole) && !order.courierName;

  // const isRoleAllowed =
  //     ["ADMIN", "MANAGER", "TELLICELSS"].includes(userRole) ||
  //     (userRole === "MODERATOR" && !isConfirmed);
  //
  // const canEdit =
  //     userRole &&
  //     isRoleAllowed &&
  //     !order?.courierName &&
  //     !isCompleted &&
  //     !isDelivered;

  const hasAccess =
    userRole && ["ADMIN", "MANAGER", "TELLICELSS"].includes(userRole);

  const withoutTellicelss = userRole && ["ADMIN", "MANAGER"].includes(userRole);

  const [editOpen, setEditOpen] = useState(false);

  const [sellerDialogOpen, setSellerDialogOpen] = useState(false);
  const [selectedSellerId, setSelectedSellerId] = useState<string>(
    (order.seller as any)?._id ?? order.seller ?? "",
  );
  const [isSaving, setIsSaving] = useState(false);
  const limit = 150;
  const { data: users } = useGetAllUsersQuery({ limit });
  const [updateSeller] = useUpdateSellerMutation();

  const sellerOptions = users?.data ?? [];

  const currentSellerName =
    (order.seller as any)?.name ??
    sellerOptions.find((u) => u._id === order.seller)?.name ??
    null;

  const handleSaveSeller = async () => {
    if (!selectedSellerId) return;
    setIsSaving(true);
    try {
      await updateSeller({
        _id: order._id,
        data: { seller: selectedSellerId },
      }).unwrap();
      toast.success("Seller assigned successfully");
      refetch();
      setSellerDialogOpen(false);
    } catch {
      toast.error("Failed to assign seller");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Order actions</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-52 rounded-xl">
          {/* View */}
          {onView && (
            <DropdownMenuItem
              className="gap-2 text-sm cursor-pointer"
              onClick={() => onView(order)}
            >
              <Eye className="h-3.5 w-3.5 text-gray-500" />
              View Details
            </DropdownMenuItem>
          )}

          {/* Edit */}
          <DropdownMenuItem
            className="gap-2 text-sm cursor-pointer text-blue-600 focus:text-blue-600 dark:text-blue-400"
            onClick={() => setEditOpen(true)}
            disabled={hasCourier && !isAdmin}
          >
            <PencilLine className="h-3.5 w-3.5" />
            Edit Order
          </DropdownMenuItem>

          {/* Assign Seller */}
          {order.isPublished && withoutTellicelss && (
            <>
              <DropdownMenuItem
                className="gap-2 text-sm cursor-pointer"
                onClick={() => setSellerDialogOpen(true)}
              >
                <UserCog className="h-3.5 w-3.5 text-gray-500" />
                <span className="flex-1">Assign Seller</span>
                {currentSellerName && (
                  <span className="truncate max-w-20 text-[10px] text-gray-400 dark:text-gray-500">
                    {currentSellerName}
                  </span>
                )}
              </DropdownMenuItem>
            </>
          )}

          {/* Confirm */}
          {order.isPublished && hasAccess && isPending && onConfirm && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 text-sm cursor-pointer text-emerald-600 focus:text-emerald-600 dark:text-emerald-400"
                onClick={() => onConfirm(order)}
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Confirm Order
              </DropdownMenuItem>
            </>
          )}

          {/* Assign Courier */}
          {order.isPublished && hasAccess && isConfirmed && onAssignCourier && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 text-sm cursor-pointer text-blue-600 focus:text-blue-600 dark:text-blue-400"
                onClick={() => onAssignCourier(order)}
                disabled={hasCourier && !isAdmin}
              >
                <Truck className="h-3.5 w-3.5" />
                Assign Courier
              </DropdownMenuItem>
            </>
          )}

          {/* Mark as Completed */}
          {order.isPublished && hasAccess && canComplete && onComplete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={cn(
                  "gap-2 text-sm font-semibold cursor-pointer",
                  "text-violet-600 focus:text-violet-600 dark:text-violet-400",
                )}
                onClick={() => onComplete(order)}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Mark as Completed
              </DropdownMenuItem>
            </>
          )}

          {/* Already completed */}
          {isCompleted && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled
                className="gap-2 text-sm text-gray-400 cursor-default"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Order Completed
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ── Edit Order Modal ── */}
      <EditOrderModal
        open={editOpen}
        order={order}
        onOpenChange={setEditOpen}
        onSuccess={refetch}
      />

      {/* ── Assign Seller Dialog ── */}
      <Dialog open={sellerDialogOpen} onOpenChange={setSellerDialogOpen}>
        <DialogContent className="sm:max-w-95 gap-0 p-0 overflow-hidden rounded-2xl border-gray-200/80 dark:border-gray-700/60">
          <div className="h-1 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-violet-500" />

          <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <UserCog className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-gray-900 dark:text-gray-50">
                Assign Seller
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-400 dark:text-gray-500">
                Order {order.customOrderId || order._id?.slice(0, 10)}
              </DialogDescription>
            </div>
          </div>

          <div className="px-5 py-5 space-y-3">
            {currentSellerName && (
              <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2 dark:border-blue-800/40 dark:bg-blue-900/10">
                <User className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  Currently:{" "}
                  <span className="font-semibold">{currentSellerName}</span>
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Select staff member
              </p>
              <Select
                value={selectedSellerId}
                onValueChange={setSelectedSellerId}
              >
                <SelectTrigger className="h-10 w-full rounded-lg border-gray-200 bg-gray-50/60 text-sm dark:border-gray-700 dark:bg-gray-800/60">
                  <SelectValue placeholder="Choose a seller…" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {sellerOptions.length === 0 ? (
                    <div className="py-6 text-center text-xs text-gray-400">
                      No staff users found
                    </div>
                  ) : (
                    sellerOptions.map((u) => (
                      <SelectItem
                        key={u._id}
                        value={u._id}
                        className="cursor-pointer text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                            style={{
                              background: `hsl(${[...u.name].reduce(
                                (a, c) => a + c.charCodeAt(0),
                                0,
                              ) % 360
                                },52%,50%)`,
                            }}
                          >
                            {u.name?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <span>{u.name}</span>
                          <span className="text-[10px] text-gray-400">
                            ({u.role})
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex gap-2 border-t border-gray-100 px-5 py-4 dark:border-gray-800">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={() => setSellerDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <button
              onClick={handleSaveSeller}
              disabled={!selectedSellerId || isSaving}
              className={cn(
                "group relative overflow-hidden inline-flex items-center gap-1.5",
                "rounded-lg px-4 py-2 text-sm font-semibold text-white",
                "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600",
                "transition-all duration-200 active:scale-95",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[200%]"
              />
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving…
                </span>
              ) : (
                "Assign"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}