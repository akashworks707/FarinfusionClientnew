/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { Plus, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CourierSettingsStats } from "./CourierSettingsStats";
import { CourierSettingsTable } from "./CourierSettingsTable";
import { CreateCourierSettingsModal } from "./CreateCourierSettingsModal";
import { UpdateCourierSettingsModal } from "./UpdateCourierSettingsModal";
import type { CourierSettings } from "@/types/courierSettings";
import {
  useGetAllCourierSettingsQuery,
  useToggleCourierSettingsStatusMutation,
  useDeleteCourierSettingsMutation,
} from "@/redux/features/courierSettings/courierSettingsApi";
import { Input } from "@/components/ui/input";

interface CourierSettingsManagementProps {
  initialParams?: Record<string, any>;
}

export function CourierSettingsManagement({
  initialParams = {},
}: CourierSettingsManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [filterSandbox, setFilterSandbox] = useState<
    "all" | "sandbox" | "live"
  >("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSettings, setSelectedSettings] =
    useState<CourierSettings | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CourierSettings | null>(
    null,
  );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const {
    data: response,
    isLoading,
    refetch,
  } = useGetAllCourierSettingsQuery({
    ...initialParams,
    page,
    limit,
    search: searchTerm || undefined,
  });

  const [toggleStatus] = useToggleCourierSettingsStatusMutation();
  const [deleteCourierSettings, { isLoading: isDeleting }] =
    useDeleteCourierSettingsMutation();

  const courierSettings = response?.data || [];
  const meta = response?.meta;

  const filteredData = courierSettings.filter((setting) => {
    if (filterStatus === "active" && !setting.isActive) return false;
    if (filterStatus === "inactive" && setting.isActive) return false;
    if (filterSandbox === "sandbox" && !setting.isSandbox) return false;
    if (filterSandbox === "live" && setting.isSandbox) return false;
    return true;
  });

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus(id).unwrap();
      toast.success("Status updated successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteCourierSettings(deleteTarget._id).unwrap();
      toast.success("Courier settings deleted successfully");
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete courier settings");
    }
  };

  const handleEdit = (settings: CourierSettings) => {
    setSelectedSettings(settings);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    const target = courierSettings.find((item) => item._id === id);

    if (!target) return;

    setDeleteTarget(target);
    setDeleteConfirmOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Courier Settings
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your delivery courier providers and configurations
          </p>
        </div>

        <Button
          onClick={() => setCreateModalOpen(true)}
          className="gap-2 rounded-md hover:cursor-pointer bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-xl transition-shadow"
        >
          <Plus className="h-5 w-5" />
          Add Courier
        </Button>
      </div>

      {/* Stats */}
      <CourierSettingsStats
        courierSettings={courierSettings}
        isLoading={isLoading}
      />

      {/* Filters & Search */}
      <Card className="rounded-2xl border-0 bg-white p-4 shadow-sm dark:bg-gray-900">
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by provider, name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border-gray-200 pl-9 dark:border-gray-800 dark:bg-gray-800"
            />
          </div>

          <Select
            value={filterStatus}
            onValueChange={(value: any) => {
              setFilterStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="rounded-xl border-gray-200 dark:border-gray-800 dark:bg-gray-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterSandbox}
            onValueChange={(value: any) => {
              setFilterSandbox(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="rounded-xl border-gray-200 dark:border-gray-800 dark:bg-gray-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="sandbox">Sandbox</SelectItem>
              <SelectItem value="live">Live</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("all");
              setFilterSandbox("all");
              setPage(1);
            }}
            className="rounded-xl"
          >
            Reset Filters
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="rounded-2xl border-0 shadow-sm dark:bg-gray-900/50">
        <CourierSettingsTable
          data={filteredData}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onToggleStatus={handleToggleStatus}
        />
      </Card>

      {/* Pagination */}
      {meta && meta.totalPage > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, meta.total)} of {meta.total} couriers
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="rounded-lg"
            >
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(meta.totalPage, 5) }).map(
                (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      onClick={() => setPage(pageNum)}
                      disabled={isLoading}
                      className={`rounded-lg ${
                        page === pageNum
                          ? "bg-amber-500 hover:bg-amber-600"
                          : ""
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                },
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
              disabled={page === meta.totalPage || isLoading}
              className="rounded-lg"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateCourierSettingsModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={refetch}
      />

      {selectedSettings && (
        <UpdateCourierSettingsModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          settings={selectedSettings}
          onSuccess={refetch}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Courier Settings</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {deleteTarget?.displayName}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="hover:cursor-pointer rounded-lg bg-rose-600 hover:bg-rose-700"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
