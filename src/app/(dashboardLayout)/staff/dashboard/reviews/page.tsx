import { Metadata } from "next";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import { ReviewsPageClient } from "@/components/dashboard/reviews/ReviewsPageClient";

export const metadata: Metadata = {
  title: "Review Management | FarinFusion",
  description: "Manage customer reviews and ratings for your products",
  keywords: "reviews, ratings, customer feedback, management",
};

export default function ReviewsPage() {
  return (
    <main className="space-y-6">
      <DashboardPageHeader
        title="Reviews"
        subTitle="Manage and monitor all product reviews"
      />
      <ReviewsPageClient />
    </main>
  );
}
