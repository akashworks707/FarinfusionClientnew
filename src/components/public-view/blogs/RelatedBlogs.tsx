import { IProductBlog } from "@/types/productBlog";
import { BlogCard } from "./BlogCard";

interface Props {
  blogs: IProductBlog[];
  category: string;
}

export function RelatedBlogs({ blogs, category }: Props) {
  if (blogs.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-baseline gap-3 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Related Articles</h2>
        <span className="text-sm text-gray-400 dark:text-gray-500">
          More from {category.replace(/_/g, " ").toLowerCase()}
        </span>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((b) => (
          <BlogCard key={b._id} blog={b} />
        ))}
      </div>
    </section>
  );
}