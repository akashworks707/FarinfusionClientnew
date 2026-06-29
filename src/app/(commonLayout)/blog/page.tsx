import type { Metadata } from "next";
import { BlogListClient } from "@/components/public-view/blogs/BlogListClient";

export const metadata: Metadata = {
  title: "Blog | FarinFusion",
  description:
    "Explore expert skincare, haircare, and beauty tips from FarinFusion. Tutorials, product guides, and more.",
  openGraph: {
    title: "Blog | FarinFusion",
    description: "Expert skincare, haircare, and beauty tips.",
    type: "website",
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-352 mx-auto px-4 sm:px-6 py-14 text-center">
          <p className="text-amber-600 dark:text-amber-400 text-xs font-bold tracking-[0.3em] uppercase mb-3">
            FarinFusion Journal
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
            Beauty. Science. Glow.
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base max-w-xl mx-auto leading-relaxed">
            Discover expert-curated skincare routines, ingredient deep-dives,
            haircare guides, and tutorials from the FarinFusion team.
          </p>
        </div>
      </div>

      {/* Listing */}
      <div className="max-w-352 mx-auto px-4 sm:px-6 py-10">
        <BlogListClient />
      </div>
    </main>
  );
}