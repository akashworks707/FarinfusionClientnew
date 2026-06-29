import { BookOpen } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
}

export function BlogEmptyState({
  title = "No blogs found",
  description = "No blog posts match your current filters. Try adjusting your search or check back later.",
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 mb-4">
        <BookOpen className="h-8 w-8 text-amber-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}