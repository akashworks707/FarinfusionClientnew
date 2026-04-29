/* eslint-disable @typescript-eslint/ban-ts-comment */
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
import DeleteAlert from "@/components/dashboard/DeleteAlert";

import {
    useGetAllTrashUsersQuery,
    useTrashUpdateUserMutation,
    useDeleteUserMutation,
} from "@/redux/features/user/user.api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";
import { IUser } from "@/types";
import {SearchForm} from "@/components/shared/search-form";
import Sort from "@/components/shared/Sort";
import TablePagination from "@/components/shared/TablePagination";
import DateFilter from "@/components/shared/DateFilter";

const TrashUserPage = () => {
    // Search + sort + pagination
    const [searchTerm, setSearchTerm] = React.useState("");
    const [sort, setSort] = React.useState("");
    const [page, setPage] = React.useState(1);
    const limit = 10;

    const [dateRange, setDateRange] = React.useState<{
        startDate?: string;
        endDate?: string;
    }>({});

    const { data, isLoading } = useGetAllTrashUsersQuery({
        ...(searchTerm && { searchTerm }),
        ...(sort && { sort }),
        ...(dateRange.startDate && { "createdAt[gte]": dateRange.startDate }),
        ...(dateRange.endDate && { "createdAt[lte]": dateRange.endDate }),
        page,
        limit,
    });

    const users: IUser[] = data?.data || [];
    const trashUsers = users.filter((user) => user.isDeleted);

    const [updateTrash] = useTrashUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();

    // ✅ Alert states
    const [alertOpen, setAlertOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [actionType, setActionType] = useState<"restore" | "delete">("delete");

    const openAlert = (id: string, type: "restore" | "delete") => {
        setSelectedUserId(id);
        setActionType(type);
        setAlertOpen(true);
    };

    // ✅ Restore
    const handleRestore = async () => {
        if (!selectedUserId) return;

        try {
            // @ts-expect-error
            await updateTrash({ _id: selectedUserId, data: { isDeleted: false } }).unwrap();
            toast.success("User restored successfully!");
        } catch {
            toast.error("Failed to restore user");
        } finally {
            setAlertOpen(false);
        }
    };

    // ❌ Permanent Delete
    const handleHardDelete = async () => {
        if (!selectedUserId) return;

        try {
            await deleteUser(selectedUserId).unwrap();
            toast.success("User permanently deleted!");
        } catch {
            toast.error("Failed to delete user");
        } finally {
            setAlertOpen(false);
        }
    };

    return (
        <div className="px-2 sm:px-6 py-6 space-y-6">
            {/* Breadcrumb */}
            <BreadCrumbPage
                BreadcrumbTitle="User Management"
                BreadCrumbLink="/staff/dashboard/admin/user-management"
                BreadCrumbPage="User Trash"
            />

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-5">
                <SearchForm onSearchChange={setSearchTerm} />
                <Sort onChange={setSort} />
                <DateFilter onChange={setDateRange} />
            </div>

            {/* Table */}
            <div className="border rounded-xl">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-6">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : trashUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-6">
                                    No Trash Users Found
                                </TableCell>
                            </TableRow>
                        ) : (
                            trashUsers.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone || "N/A"}</TableCell>
                                    <TableCell>{user.role || "N/A"}</TableCell>
                                    <TableCell className="text-red-500">Deleted</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end" className="w-44">
                                                <DropdownMenuItem
                                                    className="cursor-pointer"
                                                    onClick={() => openAlert(user._id, "restore")}
                                                >
                                                    <RotateCcw className="w-4 h-4 mr-2 text-green-500" />
                                                    Restore
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    className="text-red-500 cursor-pointer"
                                                    onClick={() => openAlert(user._id, "delete")}
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

            {/* Delete Alert */}
            <DeleteAlert
                open={alertOpen}
                onOpenChange={setAlertOpen}
                description={
                    actionType === "delete"
                        ? "This action will permanently delete the user. Are you sure?"
                        : "Are you sure you want to restore this user?"
                }
                onConfirm={actionType === "delete" ? handleHardDelete : handleRestore}
                actionType={actionType}
            />
        </div>
    );
};

export default TrashUserPage;