"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLazyCheckFraudQuery } from "@/redux/features/lead/lead.api";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { AlertCircle, CheckCircle, Search } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Props {
  open: boolean;
  onClose: () => void;
  defaultPhone?: string;
}

interface FraudData {
  total: number;
  delivered: number;
  cancelled: number;
  successRate: number;
  cancelRate: number;
  risk: "SAFE" | "MEDIUM" | "HIGH";
}

export default function FraudCheckModal({
  open,
  onClose,
  defaultPhone,
}: Props) {
  const [phone, setPhone] = useState(defaultPhone || "");
  const [trigger, { data, isLoading }] = useLazyCheckFraudQuery();

  useEffect(() => {
    if (defaultPhone) {
      setTimeout(() => {
        setPhone(defaultPhone);
      }, 100);
    }
  }, [defaultPhone, open]);

  const handleCheck = () => {
    if (!phone.trim()) return;
    trigger(phone);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCheck();
    }
  };

  const fraudData = data?.data as FraudData | undefined;
  
  // Prepare chart data
  const chartData = fraudData
    ? [
        { name: "Successful", value: fraudData.delivered, color: "#14b8a6" },
        { name: "Cancelled", value: fraudData.cancelled, color: "#ef4444" },
      ]
    : [];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "HIGH":
        return "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400";
      case "MEDIUM":
        return "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400";
      case "SAFE":
        return "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400";
      default:
        return "";
    }
  };

  const getRiskIcon = (risk: string) => {
    return risk === "SAFE" ? (
      <CheckCircle className="h-12 w-12 text-emerald-500 mb-3" />
    ) : (
      <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl p-0 bg-linear-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-950">
          {/* Header */}
          <DialogHeader className="bg-white px-6 py-3 rounded-t-lg sticky top-0 z-10">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Search className="h-6 w-6" />
              Fraud Check System
            </DialogTitle>
          </DialogHeader>
      <ScrollArea className="max-h-[70vh] pr-2">

          <div className="px-6 py-6 space-y-6">
            {/* Search Section */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <div className="flex gap-2">
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter phone number (e.g., 01622643734)"
                  className="flex-1 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500 text-base"
                />
                <Button
                  onClick={handleCheck}
                  disabled={isLoading || !phone.trim()}
                  className="hover:cursor-pointer bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 transition-all duration-300 hover:shadow-lg active:scale-95 disabled:opacity-60"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block animate-spin">⟳</span>
                      Checking...
                    </span>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Results Section */}
            {fraudData && (
              <div className="space-y-6 animate-in fade-in duration-500">
                {/* Risk Status Card */}
                <div
                  className={`border rounded-xl p-6 text-center ${getRiskColor(fraudData.risk)}`}
                >
                  <div className="flex justify-center">
                    {getRiskIcon(fraudData.risk)}
                  </div>
                  <h3 className="text-lg font-bold mb-1">
                    {fraudData.risk === "SAFE"
                      ? "✓ The number has no fraud history!"
                      : fraudData.risk === "HIGH"
                        ? "⚠ High Risk Detected"
                        : "⚠ Medium Risk"}
                  </h3>
                  <p className="text-sm opacity-90">
                    {fraudData.risk === "SAFE"
                      ? "This customer has a good delivery track record"
                      : fraudData.risk === "HIGH"
                        ? "This number has a high cancellation rate"
                        : "This number has a moderate cancellation rate"}
                  </p>
                </div>

                {/* Chart Section */}
                {fraudData.total > 0 ? (
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Order Statistics
                    </h4>
                    <div className="flex flex-col items-center space-y-4">
                      {/* Donut Chart */}
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>

                      {/* Success Rate Text */}
                      <div className="text-center">
                        <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                          {fraudData.successRate.toFixed(1)}%
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Successful Delivery Rate
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                      No orders found for this number
                    </p>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-1">
                      Total Orders
                    </p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {fraudData.total}
                    </p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-1">
                      Delivered
                    </p>
                    <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                      {fraudData.delivered}
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400 mb-1">
                      Cancelled
                    </p>
                    <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                      {fraudData.cancelled}
                    </p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-1">
                      Cancel Rate
                    </p>
                    <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                      {fraudData.cancelRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
        </DialogContent>
    </Dialog>
  );
}
