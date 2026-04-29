"use client";

import { SearchForm } from "@/components/shared/search-form";
import Sort from "@/components/shared/Sort";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import DateFilter from "@/components/shared/DateFilter";

type ProductToolbarProps = {
  onSearchChange?: (value: string) => void;
  onSortChange?: (value: string) => void;
    onDateChange?: (value: { startDate?: string; endDate?: string }) => void;
};

export default function ProductToolbar({ onSearchChange, onSortChange, onDateChange }: ProductToolbarProps) {
    const router = useRouter();
  return (
    <div className="flex items-center justify-between gap-2 w-full my-4">
      <div className="flex flex-wrap items-center gap-4">
        <SearchForm onSearchChange={onSearchChange} />
        <Sort onChange={onSortChange} />
          <DateFilter onChange={onDateChange} />
      </div>

        <div className="flex items-center gap-4">
            <Button
                type="button"
                variant="destructive"
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => router.push("/staff/dashboard/admin/product-management/trash")}
            >
                <Trash2 className="h-4 w-4" />
                Trash
            </Button>
            <Link href="/staff/dashboard/admin/product-management/create-product">
                <Button className={"cursor-pointer"}>Add Product</Button>
            </Link>
        </div>
    </div>
  );
}
