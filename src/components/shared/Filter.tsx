"use client";

import { useId } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterIcon } from "lucide-react";

type FilterProps = {
  options: { value: string; label: string }[]; // array of options
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
};

export default function Filter({
  options,
  defaultValue,
  placeholder = "Select",
  onChange,
}: FilterProps) {
  const id = useId();

  return (
    <div className="w-full md:w-auto">
      <Select
        defaultValue={defaultValue}
        onValueChange={(value) => onChange?.(value)}
      >
        <SelectTrigger className="h-[35px] w-40 flex items-center gap-2" id={id}>
          <FilterIcon size={16} className="text-gray-500" />
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
