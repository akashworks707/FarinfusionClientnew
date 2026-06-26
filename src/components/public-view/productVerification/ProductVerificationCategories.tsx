"use client";

import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "cosmetics", label: "Cosmetics" },
  { id: "electronics", label: "Electronics" },
  { id: "health", label: "Health" },
  { id: "medicine", label: "Medicine" },
  { id: "fashion", label: "Fashion" },
  { id: "accessories", label: "Accessories" },
];

interface ProductVerificationCategoriesProps {
  selected?: string;
  onSelect: (category: string) => void;
}

export function ProductVerificationCategories({
  selected = "all",
  onSelect,
}: ProductVerificationCategoriesProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
      {CATEGORIES.map((category) => (
        <Button
          key={category.id}
          onClick={() => onSelect(category.id === "all" ? "" : category.id)}
          variant={selected === (category.id === "all" ? "" : category.id) ? "default" : "outline"}
          className={`whitespace-nowrap transition-all ${
            selected === (category.id === "all" ? "" : category.id)
              ? "bg-amber-600 hover:bg-amber-700 text-white"
              : "hover:border-amber-600 dark:hover:border-amber-400"
          }`}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}
