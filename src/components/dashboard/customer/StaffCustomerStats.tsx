import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingCart, TrendingUp, Target } from 'lucide-react';

interface StaffStatsData {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

interface StaffCustomerStatsProps {
  data: StaffStatsData;
  isLoading?: boolean;
}

export const StaffCustomerStats: React.FC<StaffCustomerStatsProps> = ({
  data,
  isLoading = false,
}) => {
  const stats = [
    {
      label: 'Total Customers',
      value: isLoading ? '...' : data.totalCustomers.toString(),
      icon: Users,
      color: 'amber',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
      borderColor: 'border-amber-200 dark:border-amber-900/30',
      textColor: 'text-amber-700 dark:text-amber-300',
    },
    {
      label: 'Total Orders',
      value: isLoading ? '...' : data.totalOrders.toString(),
      icon: ShoppingCart,
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-900/30',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
    {
      label: 'Total Revenue',
      value: isLoading ? '...' : `৳${data.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      borderColor: 'border-green-200 dark:border-green-900/30',
      textColor: 'text-green-700 dark:text-green-300',
    },
    {
      label: 'Avg Order Value',
      value: isLoading ? '...' : `৳${data.averageOrderValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      icon: Target,
      color: 'purple',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      borderColor: 'border-purple-200 dark:border-purple-900/30',
      textColor: 'text-purple-700 dark:text-purple-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className={`border ${stat.borderColor} ${stat.bgColor} overflow-hidden`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.textColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};