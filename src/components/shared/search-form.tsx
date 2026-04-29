
import { Search } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarInput } from "../ui/sidebar";
import { Label } from "../ui/label";

export function SearchForm({ onSearchChange, ...props }: React.ComponentProps<"form"> & {
  onSearchChange?: (value: string) => void;
}) {
  return (
    <form {...props}>
      <SidebarGroup className="p-0 w-full">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            id="search"
            placeholder="Search..."
            className="pl-8 clear-both h-9"
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
          <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}
