"use client";

import { SearchForm } from "@/components/shared/search-form";
import Sort from "@/components/shared/Sort";
import {Button} from "@/components/ui/button";
import {Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import CreateBrandModal from "./CreateBrandModal";
import DateFilter from "@/components/shared/DateFilter";

type CategoryToolbarProps = {
  onSearchChange?: (value: string) => void;
  onSortChange?: (value: string) => void;
    onDateChange?: (value: { startDate?: string; endDate?: string }) => void;
};

export default function CategoryToolbar({
  onSearchChange,
  onSortChange,onDateChange

}: CategoryToolbarProps) {
    const router = useRouter();
  return (
    <div className="lg:flex space-y-2 lg:space-y-0 items-center justify-between gap-2 w-full my-4">
      <div className="lg:flex items-center space-y-2 lg:space-y-0 gap-4">
        {/* Search */}
        <SearchForm onSearchChange={onSearchChange} />

        <div className={"flex gap-4"}>
            {/* Sort */}
            <Sort onChange={onSortChange} />

            <DateFilter onChange={onDateChange} />
        </div>
      </div>

      {/* Create Category Modal */}
        <div className="flex gap-4 items-center">
            <Button
                type="button"
                variant="destructive"
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => router.push("/staff/dashboard/admin/brand-management/trash")}
            >
                <Trash2 className="h-4 w-4" />
                Trash
            </Button>

            <CreateBrandModal />
        </div>
    </div>
  );
}
