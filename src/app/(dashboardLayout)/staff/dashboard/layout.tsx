"use client";

import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useGlobalBarcodeScanner } from "@/hooks/useGlobalBarcodeScanner";
import ReduxProvider from "@/providers/ReduxProvider";

function GlobalScanner() {
  useGlobalBarcodeScanner();
  return null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <SidebarProvider>
        <GlobalScanner />
        <DashboardContent>{children}</DashboardContent>
      </SidebarProvider>
    </ReduxProvider>
  );
}
