"use client";

import * as React from "react";
import {ArrowUpDown, Plus, Search, Trash2} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import LeadAddedModal from "@/components/dashboard/leads/LeadAddedModal";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {useRouter} from "next/navigation";

type Props = {
    searchTerm: string;
    setSearchTerm: (searchTerm: string) => void;
    sortValue: "" | "newest" | "oldest";
    setSortValue: (value: "newest" | "oldest") => void;
};

const LeadFilterComponent = ({searchTerm, setSearchTerm, sortValue, setSortValue,}: Props) => {
    const [leadAddModalOpen, setLeadAddModalOpen] = useState(false);
    const router = useRouter();

    return (
        <div>
            <div className="grid grid-cols-1 sm:flex items-center justify-between gap-4 py-4 bg-card">
                {/* Left Side: Search + Sort */}
                <div className="flex items-center gap-2">
                    {/* Search */}
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search Leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>

                    {/* Sort using Select */}
                    <Select
                        value={sortValue}
                        onValueChange={(value) =>
                            setSortValue(value as "newest" | "oldest")
                        }
                    >
                        <SelectTrigger className="w-40 h-9 flex items-center justify-between">
                            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Right Side: Add */}

                <div className={"flex items-center gap-4"}>
                    <Button
                        type="button"
                        variant="destructive"
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => router.push("/staff/dashboard/leads/trash")}
                    >
                        <Trash2 className="h-4 w-4" />
                        Trash
                    </Button>
                    <Button size="sm" onClick={() => setLeadAddModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Lead
                    </Button>
                </div>
            </div>

            {/* Lead Added Modal */}
            <LeadAddedModal open={leadAddModalOpen} onOpenChange={setLeadAddModalOpen} />
        </div>
    );
};

export default LeadFilterComponent;