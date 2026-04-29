"use client";

import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import BreadCrumbPage from "@/components/shared/BreadCrumbPage";
import {
    useDeleteCategoryMutation,
    useGetAllTrashCategoriesQuery,
    useTrashUpdateCategoryMutation
} from "@/redux/features/category/category.api";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";
import { ICategory } from "@/types";
import DeleteAlert from "@/components/dashboard/DeleteAlert";
import {SearchForm} from "@/components/shared/search-form";
import Sort from "@/components/shared/Sort";
import TablePagination from "@/components/shared/TablePagination";
import DateFilter from "@/components/shared/DateFilter"; // ✅ correct type

const TrashCategoryPage = () => {
    // Search + sort + pagination
    const [searchTerm, setSearchTerm] = React.useState("");
    const [sort, setSort] = React.useState("");
    const [page, setPage] = React.useState(1);
    const limit = 10;

    const [dateRange, setDateRange] = React.useState<{
        startDate?: string;
        endDate?: string;
    }>({});


    const { data, isLoading } = useGetAllTrashCategoriesQuery({
        ...(searchTerm && { searchTerm }),
        ...(sort && { sort }),
        ...(dateRange.startDate && { "createdAt[gte]": dateRange.startDate }),
        ...(dateRange.endDate && { "createdAt[lte]": dateRange.endDate }),
        page,
        limit,
    });

    const categories: ICategory[] = data?.data || [];

    const [restoreCategory] = useTrashUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    // ✅ Alert states
    const [alertOpen, setAlertOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [actionType, setActionType] = useState<"restore" | "delete">("delete");

    const openAlert = (id: string, type: "restore" | "delete") => {
        setSelectedId(id);
        setActionType(type);
        setAlertOpen(true);
    };

    // ✅ Restore
    const handleRestore = async () => {
        if (!selectedId) return;

        try {
            const res = await restoreCategory({ _id: selectedId }).unwrap();
            if (res.success) {
                toast.success("Category restored successfully");
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Restore failed");
        } finally {
            setAlertOpen(false);
        }
    };

    // ❌ Permanent Delete
    const handleHardDelete = async () => {
        if (!selectedId) return;

        try {
            const res = await deleteCategory(selectedId).unwrap();
            if (res.success) {
                toast.success("Category permanently deleted");
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Delete failed");
        } finally {
            setAlertOpen(false);
        }
    };

    return (
        <div className="px-2 sm:px-6 py-6 space-y-6">
            {/* Breadcrumb */}
            <BreadCrumbPage
                BreadcrumbTitle={"Category Management"}
                BreadCrumbLink={"/staff/dashboard/admin/category-management"}
                BreadCrumbPage={"Category Trash"}
            />

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
                <SearchForm onSearchChange={setSearchTerm} />
                <Sort onChange={setSort} />
                <DateFilter onChange={setDateRange} />
            </div>

            {/* Table */}
            <div className="border rounded-xl">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Category Title</TableHead>
                            <TableHead>Product Count</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-6">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-6">
                                    No Trash Category Found
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category) => (
                                <TableRow key={category._id}>
                                    <TableCell className="font-medium">
                                        {category.title}
                                    </TableCell>
                                    <TableCell>
                                        {category?.productCount ?? "0"}
                                    </TableCell>
                                    <TableCell className="text-red-500">
                                        Deleted
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button className={"cursor-pointer"} variant="ghost" size="icon">
                                                    <MoreHorizontal />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end" className="w-44">

                                                {/* Restore */}
                                                <DropdownMenuItem
                                                    className={"cursor-pointer"}
                                                    onClick={() => openAlert(category._id, "restore")}
                                                >
                                                    <RotateCcw className="w-4 h-4 mr-2 text-green-500" />
                                                    Restore
                                                </DropdownMenuItem>

                                                {/* Delete */}
                                                <DropdownMenuItem
                                                    className="text-red-500 cursor-pointer"
                                                    onClick={() => openAlert(category._id, "delete")}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete Forever
                                                </DropdownMenuItem>

                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/*pagination*/}
            <TablePagination
                currentPage={page}
                totalPages={data?.meta?.totalPage ?? 1}
                onPageChange={setPage}
            />
            {/* ✅ Alert */}
            <DeleteAlert
                open={alertOpen}
                onOpenChange={setAlertOpen}
                description={
                    actionType === "delete"
                        ? "This action will permanently delete the category. Are you sure?"
                        : "Are you sure you want to restore this category?"
                }
                onConfirm={
                    actionType === "delete" ? handleHardDelete : handleRestore
                }
                actionType={actionType}
            />
        </div>
    );
};

export default TrashCategoryPage;