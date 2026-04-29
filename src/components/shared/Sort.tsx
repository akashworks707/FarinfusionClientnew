import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

export default function Sort({ onChange }: { onChange?: (value: string) => void }) {
  return (
    <Select onValueChange={(value) => onChange?.(value)}>
      <SelectTrigger className="h-7.5 w-40 cursor-pointer">
        <ArrowUpDown size={13} />
        <SelectValue placeholder="Sort" />
      </SelectTrigger>

      <SelectContent position="popper">
        <SelectItem className={"cursor-pointer"} value="-createdAt">Newest</SelectItem>
        <SelectItem className={"cursor-pointer"} value="createdAt">Oldest</SelectItem>
      </SelectContent>
    </Select>
  );
}
