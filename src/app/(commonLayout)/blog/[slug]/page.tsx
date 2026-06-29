import type { Metadata } from "next";
import { BlogDetailClient } from "@/components/public-view/blogs/BlogDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

// Dynamic metadata based on slug (best-effort — uses slug as fallback)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Decode slug for a readable title fallback
  const titleFallback = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${titleFallback} | FarinFusion Blog`,
    description: `Read ${titleFallback} on the FarinFusion Blog.`,
    openGraph: {
      title: titleFallback,
      type: "article",
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 mb-4">
        {/* Top bar stripe */}
        <div className="h-1 bg-linear-to-r from-amber-400 via-amber-500 to-amber-400" />
      </div>
      <BlogDetailClient slug={slug} />
    </main>
  );
}
