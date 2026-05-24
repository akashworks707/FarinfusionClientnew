/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { toast } from "sonner";
import {
  useGetAllProductPurchasesQuery,
  useDeleteProductPurchaseMutation,
  useCreateProductPurchaseMutation,
  useUpdateProductPurchaseMutation,
  useUpdatePurchaseStatusMutation,
  useGetPurchaseStatsQuery,
} from "@/redux/features/productPurchase/productPurchaseApi";
import { useGetAllProductsQuery } from "@/redux/features/product/product.api";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { ProductPurchaseStats } from "@/components/dashboard/product-purchase/ProductPurchaseStats";
import { ProductPurchaseTable } from "@/components/dashboard/product-purchase/ProductPurchaseTable";
import { ProductPurchaseToolbar } from "@/components/dashboard/product-purchase/ProductPurchaseToolbar";
import { ProductPurchaseForm } from "@/components/dashboard/product-purchase/ProductPurchaseForm";
import TablePagination from "@/components/shared/TablePagination";
import DashboardManagementPageSkeleton from "@/components/dashboard/DashboardManagePageSkeleton";
import DeleteAlert from "@/components/dashboard/DeleteAlert";
import ProductPurchaseDetailsModal from "@/components/dashboard/product-purchase/ProductPurchaseDetailsModal";
import { IPurchase } from "@/types/purchase";

interface Purchase {
  _id: string;
  product?: { title?: string };
  supplierName: string;
  supplierPhone?: string;
  quantity: number;
  buyingPrice: number;
  totalAmount?: number;
  grandTotal?: number;
  paymentStatus: string;
  purchaseStatus: string;
  invoiceNo?: string;
  purchaseDate: string;
}

const ProductPurchaseManagement = () => {
  const [deleteProductPurchase] = useDeleteProductPurchaseMutation();
  const [createProductPurchase] = useCreateProductPurchaseMutation();
  const [updateProductPurchase] = useUpdateProductPurchaseMutation();
  const [updatePurchaseStatus] = useUpdatePurchaseStatusMutation();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [purchaseStatus, setPurchaseStatus] = React.useState("");
  const [paymentStatus, setPaymentStatus] = React.useState("");
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useGetAllProductPurchasesQuery({
    ...(searchTerm && { searchTerm }),
    ...(purchaseStatus && { purchaseStatus }),
    ...(paymentStatus && { paymentStatus }),
    page,
    limit,
  });

  const { data: productsData, refetch: refetchProducts } =
    useGetAllProductsQuery({ limit: 1000 });
  const { data: statsData, refetch: refetchStats } =
    useGetPurchaseStatsQuery(undefined);

  // Modal and delete states
  const [selectedPurchase, setSelectedPurchase] =
    React.useState<IPurchase | null>(null);
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = React.useState<any | null>(
    null,
  );
  const [openDeleteAlert, setOpenDeleteAlert] = React.useState(false);

  // Form states
  const [openFormModal, setOpenFormModal] = React.useState(false);
  const [editingPurchase, setEditingPurchase] =
    React.useState<IPurchase | null>(null);

  // Calculate statistics
  // const stats = useMemo(() => {
  //   const purchases = data?.data || [];

  //   const totalPurchases = purchases.length;

  //   const grandTotal = purchases.reduce(
  //     (sum: number, p: any) => sum + (p.totalAmount || 0),
  //     0,
  //   );

  //   const pendingPayments = purchases.filter(
  //     (p: any) => p.paymentStatus !== "PAID",
  //   ).length;

  //   const totalProfit = purchases.reduce((sum: number, p: any) => {
  //     const purchaseProfit =
  //       p.products?.reduce((acc: number, item: any) => {
  //         const sellingPrice = item.product?.price || 0;

  //         const buyingPrice = item.buyingPrice || 0;

  //         return acc + (sellingPrice - buyingPrice) * item.quantity;
  //       }, 0) || 0;

  //     return sum + purchaseProfit;
  //   }, 0);

  //   return {
  //     totalPurchases,
  //     grandTotal,
  //     totalProfit,
  //     pendingPayments,
  //   };
  // }, [data]);

  const handleDelete = async (purchase: Purchase) => {
    try {
      const res = await deleteProductPurchase(purchase._id).unwrap();
      if (res.success) {
        toast.success("Purchase deleted successfully");
        await refetchStats();
        await refetchProducts();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete purchase");
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingPurchase) {
        // Update existing purchase
        const res = await updateProductPurchase({
          _id: editingPurchase._id,
          data: formData,
        }).unwrap();
        if (res.success) {
          await refetchStats();
          await refetchProducts();
          toast.success("Purchase updated successfully");
        }
      } else {
        // Create new purchase
        const res = await createProductPurchase(formData).unwrap();
        if (res.success) {
          await refetchStats();
          await refetchProducts();
          toast.success("Purchase created successfully");
        }
      }
      setOpenFormModal(false);
      setEditingPurchase(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save purchase");
    }
  };

  const uniqueSuppliers = React.useMemo(() => {
    const purchases = data?.data || [];

    const supplierMap = new Map();

    purchases.forEach((purchase: IPurchase) => {
      if (!purchase.supplierName?.trim()) return;

      const key = purchase.supplierPhone || purchase.supplierName;

      if (!supplierMap.has(key)) {
        supplierMap.set(key, {
          supplierName: purchase.supplierName,
          supplierPhone: purchase.supplierPhone || "",
          supplierAddress: purchase.supplierAddress || "",
        });
      }
    });

    return Array.from(supplierMap.values());
  }, [data]);

  const handleStatusChange = async (
    purchaseId: string,
    statusType: "purchase" | "payment",
    newStatus: string,
  ) => {
    try {
      const payload =
        statusType === "purchase"
          ? {
              _id: purchaseId,
              purchaseStatus: newStatus,
            }
          : {
              _id: purchaseId,
              paymentStatus: newStatus,
            };

      const res = await updatePurchaseStatus(payload).unwrap();

      if (res.success) {
        await refetchStats();
        await refetchProducts();
        toast.success("Status updated successfully");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  if (isLoading) return <DashboardManagementPageSkeleton />;
  if (isError)
    return (
      <div className="p-6">
        <p className="text-red-600 dark:text-red-400">
          Error loading product purchases
        </p>
      </div>
    );

  return (
    <div className="space-y-6">
      <DashboardPageHeader title="Product Purchase Management" />

      {/* Statistics */}
      <ProductPurchaseStats data={statsData?.data} isLoading={isLoading} />

      {/* Toolbar */}
      <ProductPurchaseToolbar
        onSearchChange={setSearchTerm}
        onStatusChange={setPurchaseStatus}
        onPaymentStatusChange={setPaymentStatus}
        onReset={() => {
          setSearchTerm("");
          setPurchaseStatus("");
          setPaymentStatus("");
          setPage(1);
        }}
        onCreate={() => {
          setEditingPurchase(null);
          setOpenFormModal(true);
        }}
      />

      {/* Table */}
      <ProductPurchaseTable
        purchases={data?.data || []}
        isLoading={isLoading}
        onView={(purchase) => {
          setSelectedPurchase(purchase);
          setOpenViewModal(true);
        }}
        onStatusChange={handleStatusChange}
        onEdit={(purchase) => {
          setEditingPurchase(purchase);
          setOpenFormModal(true);
        }}
        onDelete={(purchase) => {
          setPurchaseToDelete(purchase);
          setOpenDeleteAlert(true);
        }}
      />

      {/* Pagination */}
      <TablePagination
        currentPage={page}
        totalPages={data?.meta?.totalPage ?? 1}
        onPageChange={setPage}
      />

      {/* Form Modal */}
      <ProductPurchaseForm
        open={openFormModal}
        onOpenChange={setOpenFormModal}
        initialData={editingPurchase}
        suppliers={uniqueSuppliers}
        products={productsData?.data || []}
        onSubmit={handleFormSubmit}
      />

      {/* View Modal */}
      {selectedPurchase && (
        <ProductPurchaseDetailsModal
          open={openViewModal}
          onOpenChange={setOpenViewModal}
          purchase={selectedPurchase}
        />
      )}

      {/* Delete Confirmation */}
      {purchaseToDelete && (
        <DeleteAlert
          open={openDeleteAlert}
          onOpenChange={setOpenDeleteAlert}
          description={`Are you sure you want to delete this purchase from ${purchaseToDelete.supplierName}? Deleting this purchase will reverse inventory stock updates permanently.`}
          onConfirm={async () => {
            await handleDelete(purchaseToDelete);
            setOpenDeleteAlert(false);
            setPurchaseToDelete(null);
          }}
          actionType="delete"
        />
      )}
    </div>
  );
};

export default ProductPurchaseManagement;
