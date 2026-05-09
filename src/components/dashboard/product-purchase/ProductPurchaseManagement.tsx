/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import { toast } from "sonner";
import {
  useGetAllProductPurchasesQuery,
  useDeleteProductPurchaseMutation,
  useCreateProductPurchaseMutation,
  useUpdateProductPurchaseMutation,
//   useUpdatePurchaseStatusMutation,
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

interface Purchase {
  _id: string;
  product?: { title?: string };
  supplierName: string;
  supplierPhone?: string;
  quantity: number;
  buyingPrice: number;
  totalAmount: number;
  paymentStatus: string;
  purchaseStatus: string;
  invoiceNo?: string;
  purchaseDate: string;
}

const ProductPurchaseManagement = () => {
  const [deleteProductPurchase] = useDeleteProductPurchaseMutation();
  const [createProductPurchase] = useCreateProductPurchaseMutation();
  const [updateProductPurchase] = useUpdateProductPurchaseMutation();
//   const [updatePurchaseStatus] = useUpdatePurchaseStatusMutation();

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

  const { data: productsData } = useGetAllProductsQuery({});

  // Modal and delete states
  const [selectedPurchase, setSelectedPurchase] =
    React.useState<Purchase | null>(null);
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [purchaseToDelete, setPurchaseToDelete] =
    React.useState<Purchase | null>(null);
  const [openDeleteAlert, setOpenDeleteAlert] = React.useState(false);

  // Form states
  const [openFormModal, setOpenFormModal] = React.useState(false);
  const [editingPurchase, setEditingPurchase] = React.useState<Purchase | null>(
    null,
  );

  // Calculate statistics
  const stats = useMemo(() => {
    const purchases = data?.data || [];
    const totalPurchases = purchases.length;
    const totalAmount = purchases.reduce(
      (sum: number, p: any) => sum + (p.totalAmount || 0),
      0,
    );
    const pendingPayments = purchases.filter(
      (p: any) => p.paymentStatus !== "PAID",
    ).length;

    // Calculate profit: (selling price - buying price) * quantity
    const totalProfit = purchases.reduce((sum: number, p: any) => {
      const product = p.product as any;
      const sellingPrice = product?.price || 0;
      const buyingPrice = p.buyingPrice || 0;
      const profit = (sellingPrice - buyingPrice) * (p.quantity || 0);
      return sum + Math.max(0, profit);
    }, 0);

    return {
      totalPurchases,
      totalAmount,
      totalProfit,
      pendingPayments,
    };
  }, [data]);

  const handleDelete = async (purchase: Purchase) => {
    try {
      const res = await deleteProductPurchase(purchase._id).unwrap();
      if (res.success) {
        toast.success("Purchase deleted successfully");
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
          toast.success("Purchase updated successfully");
        }
      } else {
        // Create new purchase
        const res = await createProductPurchase(formData).unwrap();
        if (res.success) {
          toast.success("Purchase created successfully");
        }
      }
      setOpenFormModal(false);
      setEditingPurchase(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save purchase");
    }
  };

  //   const handleStatusChange = async (purchaseId: string, newStatus: string) => {
  //     try {
  //       const res = await updatePurchaseStatus({
  //         id: purchaseId,
  //         status: newStatus,
  //       }).unwrap();
  //       if (res.success) {
  //         toast.success("Status updated successfully");
  //       }
  //     } catch (error: any) {
  //       toast.error(error?.data?.message || "Failed to update status");
  //     }
  //   };

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
      <ProductPurchaseStats data={stats} isLoading={isLoading} />

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
        // onStatusChange={async (id, type, status) => {
        //   await updatePurchaseStatus(id);
        // }}
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
          description={`Are you sure you want to delete this purchase from ${purchaseToDelete.supplierName}? This action cannot be undone.`}
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
