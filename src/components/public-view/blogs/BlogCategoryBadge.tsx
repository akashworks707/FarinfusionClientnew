import { categoryColors, categoryLabel } from "@/utils/blogHelpers";

interface Props {
  category: string;
  size?: "sm" | "md";
}

export function BlogCategoryBadge({ category, size = "sm" }: Props) {
  const { bg, text } = categoryColors(category);
  const cls = size === "md" ? "px-3 py-1 text-xs" : "px-2.5 py-0.5 text-[11px]";
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold uppercase tracking-wide ${cls} ${bg} ${text}`}
    >
      {categoryLabel(category)}
    </span>
  );
}