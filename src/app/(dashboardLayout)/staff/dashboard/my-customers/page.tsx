import MyCustomers from "@/components/dashboard/customer/MyCustomers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Customers | Dashboard",
  description: "View and manage your customers in the dashboard.",
};

export default function MyCustomersPage() {
  return <MyCustomers />;
}
