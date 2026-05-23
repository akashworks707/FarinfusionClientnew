import type { Metadata } from "next";
import { CourierSettingsManagement } from "@/components/dashboard/CourierSettings/CourierSettingsManagement";

export const metadata: Metadata = {
  title: "Courier Settings | Farin Fusion Admin",
  description: "Manage courier providers and delivery configurations",
};

export default function CourierSettingsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-8">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <CourierSettingsManagement />
      </div>
    </div>
  );
}
