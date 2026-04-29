"use client";

import { SearchForm } from "@/components/shared/search-form";
import CreateCategoryModal from "./CreateCategoryModal";
import {Button} from "@/components/ui/button";
import {Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import CategorySort from "@/components/dashboard/category/CategorySort";
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
    <div className="sm:flex space-y-2 sm:space-y-0 items-center justify-between gap-2 w-full my-4">
      <div className="sm:flex items-center space-y-2 sm:space-y-0 gap-4">
        {/* Search */}
        <SearchForm onSearchChange={onSearchChange} />

        {/* Sort */}
          <div className={"grid grid-cols-2 gap-4 items-center"}>
              <CategorySort onChange={onSortChange} />
              <DateFilter onChange={onDateChange} />
          </div>
      </div>

      {/* Create Category Modal */}
        <div className="grid grid-cols-2 items-center gap-4">
            <Button
                type="button"
                variant="destructive"
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => router.push("/staff/dashboard/admin/category-management/trash")}
            >
                <Trash2 className="h-4 w-4" />
                Trash
            </Button>
            <CreateCategoryModal />
        </div>
    </div>
  );
}
