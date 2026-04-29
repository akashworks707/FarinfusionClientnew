"use client";

import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";

interface DataTableToolbarProps<T> {
  table: Table<T>;
  searchColumns?: string[];
}

export function DataTableToolbar<T>({ table, searchColumns }: DataTableToolbarProps<T>) {
  return (
    <div className="flex items-center py-4 gap-2">
      {searchColumns?.map((col) => (
        <Input
          key={col}
          placeholder={`Search ${col}`}
          value={(table.getColumn(col)?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn(col)?.setFilterValue(e.target.value)}
          className="max-w-xs"
        />
      ))}
    </div>
  );
}
