// components/pos/category-filter.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListFilter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";

interface CategoryFilterProps {
  onChange?: (value: string) => void;
}

export default function CategoryFilter({ onChange }: CategoryFilterProps) {
  const { data, isLoading } = useGetAllCategoriesQuery({});

  console.log("categories ", data);

  const categories = data?.data || [];

  // "All Categories" এর জন্য dummy value "all" ব্যবহার করা হচ্ছে
  const allCategories = [
    { _id: "all", title: "All Categories" }, // ← এখানে _id: "all" (খালি নয়)
    ...categories,
  ];

  if (isLoading) {
    return <Skeleton className="h-7.5 w-40" />;
  }

  return (
    <Select
      onValueChange={(value) => {
        // "all" হলে parent-কে খালি স্ট্রিং পাঠাও (backend-এ category না পাঠানোর জন্য)
        onChange?.(value === "all" ? "" : value);
      }}
    >
      <SelectTrigger className="h-7.5 w-40">
        <ListFilter size={13} />
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        {allCategories.map((cat) => (
          <SelectItem key={cat._id} value={cat._id}>
            {cat.title}   {/* তোমার data-তে title আছে, name নয় */}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}