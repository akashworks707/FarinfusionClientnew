
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { OrderStatusBadge } from "./OrderStatusBadge";
// import { CourierInfo } from "./CourierInfo";
// import {
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   Clock,
//   Car,
// } from "lucide-react";
// import type { Order } from "@/types/orders";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import { useGetCourierByOrderIdQuery } from "@/lib/hooks";

// interface OrderDetailsModalProps {
//   order: Order | null;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// export function OrderDetailsModal({
//   order,
//   open,
//   onOpenChange,
// }: OrderDetailsModalProps) {
//   const { data: courierRes } = useGetCourierByOrderIdQuery(order?._id || "", {
//     skip: !order?._id,
//   });

//   const courier = courierRes?.data;

//   if (!order) return null;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-2xl">
//         <ScrollArea className="max-h-[90vh] overflow-y-auto pr-4">
//           <DialogHeader>
//             <DialogTitle className="flex items-center justify-between">
//               <span>Order Details</span>
//               <Badge variant="outline" className="font-mono">
//                 {order.customOrderId || order._id?.slice(0, 10)}
//               </Badge>
//             </DialogTitle>
//             <DialogDescription>
//               Created on {new Date(order.createdAt).toLocaleDateString()}
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-6 py-4">
//             {/* Status Section */}
//             <div className="space-y-3 rounded-lg border p-4">
//               <p className="text-sm font-semibold">Status Information</p>
//               <div className="grid gap-3 sm:grid-cols-2">
//                 <div>
//                   <p className="text-xs text-muted-foreground">Order Status</p>
//                   <div className="mt-1">
//                     <OrderStatusBadge status={order.orderStatus} type="order" />
//                   </div>
//                 </div>
//                 <div>
//                   <p className="text-xs text-muted-foreground">
//                     Delivery Status
//                   </p>
//                   <div className="mt-1">
//                     <OrderStatusBadge
//                       status={order.deliveryStatus}
//                       type="delivery"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Customer Information */}
//             <div className="space-y-3 rounded-lg border p-4">
//               <p className="text-sm font-semibold">Customer Information</p>
//               <div className="space-y-2">
//                 <div className="flex items-start gap-3">
//                   <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
//                   <div className="flex-1">
//                     <p className="text-xs text-muted-foreground">Name</p>
//                     <p className="font-medium">
//                       {order.billingDetails?.fullName}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
//                   <div className="flex-1">
//                     <p className="text-xs text-muted-foreground">Email</p>
//                     <p className="font-medium">{order.billingDetails?.email}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
//                   <div className="flex-1">
//                     <p className="text-xs text-muted-foreground">Phone</p>
//                     <p className="font-medium">{order.billingDetails?.phone}</p>
//                   </div>
//                 </div>
//                 {order?.billingDetails?.address && (
//                   <div className="flex items-start gap-3">
//                     <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
//                     <div className="flex-1">
//                       <p className="text-xs text-muted-foreground">
//                         Shipping Address
//                       </p>
//                       <p className="font-medium">
//                         {order.billingDetails?.address}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="space-y-3 rounded-lg border p-4">
//               <p className="text-sm font-semibold">Order Items</p>
//               <div className="space-y-2">
//                 {order?.products.map((product: any, idx: number) => (
//                   <div
//                     key={idx}
//                     className="flex items-start justify-between border-t pt-2 first:border-t-0 first:pt-0"
//                   >
//                     <div className="flex-1">
//                       <p className="font-medium">{product.product?.title}</p>
//                       <p className="text-xs text-muted-foreground">
//                         Qty: {product.quantity} × ৳{product?.price?.toFixed(2)}
//                       </p>
//                     </div>
//                     <p className="font-medium">
//                       ৳{(product.quantity * product.price)?.toFixed(2)}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//  <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <Car className="h-4 w-4 text-muted-foreground" />
//                   <span className="text-sm font-medium">Delivery Charge</span>
//                 </div>
//                 <p className="text-xl font-bold">৳{order?.shippingCost}</p>
//               </div>
//             </div>

//             {/* Order Summary */}
//             <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
                  
//                   <span className="text-sm font-medium">Total Amount</span>
//                 </div>
//                 <p className="text-xl font-bold">৳{order?.total?.toFixed(2)}</p>
//               </div>
//               <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                 <Clock className="h-3 w-3" />
//                 <span>
//                   Updated: {new Date(order.updatedAt).toLocaleString()}
//                 </span>
//               </div>
//             </div>

           

//             {courier && <CourierInfo courier={courier} />}
//           </div>
//           <ScrollBar orientation="vertical" />
//         </ScrollArea>
//       </DialogContent>
//     </Dialog>
//   );
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { CourierInfo } from "./CourierInfo";
import { User, Mail, Phone, MapPin, Clock, Car, Zap } from "lucide-react";
import { format } from "date-fns";
import type { Order } from "@/types/orders";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useGetCourierByOrderIdQuery } from "@/lib/hooks";

interface OrderDetailsModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsModal({
  order,
  open,
  onOpenChange,
}: OrderDetailsModalProps) {
  const { data: courierRes } = useGetCourierByOrderIdQuery(order?._id || "", {
    skip: !order?._id,
  });

  const courier = courierRes?.data;

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <ScrollArea className="max-h-[90vh] overflow-y-auto pr-4">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Order Details</span>
              <Badge variant="outline" className="font-mono">
                {order.customOrderId || order._id?.slice(0, 10)}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Created on {new Date(order.createdAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Status Section */}
            <div className="space-y-3 rounded-lg border p-4">
              <p className="text-sm font-semibold">Status Information</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Order Status</p>
                  <div className="mt-1">
                    <OrderStatusBadge status={order.orderStatus} type="order" />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Delivery Status
                  </p>
                  <div className="mt-1">
                    <OrderStatusBadge
                      status={order.deliveryStatus}
                      type="delivery"
                    />
                  </div>
                </div>
              </div>
              {order.scheduledAt && (
                <div className="pt-3 border-t space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                      Scheduled Order
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {format(new Date(order.scheduledAt), "PPpp")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Scheduled processing date & time
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Information */}
            <div className="space-y-3 rounded-lg border p-4">
              <p className="text-sm font-semibold">Customer Information</p>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium">
                      {order.billingDetails?.fullName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{order.billingDetails?.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{order.billingDetails?.phone}</p>
                  </div>
                </div>
                {order?.billingDetails?.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        Shipping Address
                      </p>
                      <p className="font-medium">
                        {order.billingDetails?.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <p className="text-sm font-semibold">Order Items</p>
              <div className="space-y-2">
                {order?.products.map((product: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between border-t pt-2 first:border-t-0 first:pt-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{product.product?.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {product.quantity} × ৳{product?.price?.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-medium">
                      ৳{(product.quantity * product.price)?.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Delivery Charge</span>
                </div>
                <p className="text-xl font-bold">৳{order?.shippingCost}</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Total Amount</span>
                </div>
                <p className="text-xl font-bold">৳{order?.total?.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>
                  Updated: {new Date(order.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>

            {courier && <CourierInfo courier={courier} />}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
