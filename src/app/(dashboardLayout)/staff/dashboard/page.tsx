import DashboardOverview from "@/components/dashboard/overview/DashboardOverview";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Overview",
  description: "View key metrics and insights about your store's performance.",
};

export default function DashboardOverviewPage() {
  return <DashboardOverview />;
}
