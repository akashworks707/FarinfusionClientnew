"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    useDeleteLeadMutation,
    useGetAllTrashLeadsQuery,
    useTrashUpdateLeadMutation
} from "@/redux/features/lead/lead.api";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";
import {ILead} from "@/types/lead.types";
import DeleteAlert from "@/components/dashboard/DeleteAlert";
import {SearchForm} from "@/components/shared/search-form";
import Sort from "@/components/shared/Sort";
import TablePagination from "@/components/shared/TablePagination";
import DateFilter from "@/components/shared/DateFilter";

const TrashLeadPage = () => {
    // Search + sort + pagination
    const [searchTerm, setSearchTerm] = React.useState("");
    const [sort, setSort] = React.useState("");
    const [page, setPage] = React.useState(1);
    const limit = 10;

    const [dateRange, setDateRange] = React.useState<{
        startDate?: string;
        endDate?: string;
    }>({});



    const { data, isLoading } = useGetAllTrashLeadsQuery({
        ...(searchTerm && { searchTerm }),
        ...(sort && { sort }),
        ...(dateRange.startDate && { "createdAt[gte]": dateRange.startDate }),
        ...(dateRange.endDate && { "createdAt[lte]": dateRange.endDate }),
        page,
        limit,
    });

    const leads: ILead[] = data?.data || [];

    const [restoreLead] = useTrashUpdateLeadMutation();
    const [deleteLead] = useDeleteLeadMutation();

    // ✅ Alert state
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
            const res = await restoreLead({ _id: selectedId }).unwrap();
            if (res.success) {
                toast.success("Lead restored successfully");
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Restore failed");
        } finally {
            setAlertOpen(false);
        }
    };

    // ❌ Delete
    const handleDelete = async () => {
        if (!selectedId) return;

        try {
            const res = await deleteLead(selectedId).unwrap();
            if (res.success) {
                toast.success("Lead permanently deleted");
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
                BreadcrumbTitle={"Leads Management"}
                BreadCrumbLink={"/staff/dashboard/leads"}
                BreadCrumbPage={"Leads Trash"}
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
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-6">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : leads.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-6">
                                    No Trash Leads Found
                                </TableCell>
                            </TableRow>
                        ) : (
                            leads.map((lead) => (
                                <TableRow key={lead._id}>
                                    <TableCell className="font-medium">
                                        {lead.name}
                                    </TableCell>
                                    <TableCell>{lead.email}</TableCell>
                                    <TableCell>{lead.phone}</TableCell>
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
                                                    onClick={() => openAlert(lead._id, "restore")}
                                                >
                                                    <RotateCcw className="w-4 h-4 mr-2 text-green-500" />
                                                    Restore
                                                </DropdownMenuItem>

                                                {/* Delete */}
                                                <DropdownMenuItem
                                                    className="text-red-500 cursor-pointer"
                                                    onClick={() => openAlert(lead._id, "delete")}
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
                        ? "This action will permanently delete the lead. Are you sure?"
                        : "Are you sure you want to restore this lead?"
                }
                onConfirm={
                    actionType === "delete" ? handleDelete : handleRestore
                }
                actionType={actionType}
            />
        </div>
    );
};

export default TrashLeadPage;