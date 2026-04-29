'use client';

import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { IDashboardOverview } from '@/types/dashboard-overview';

interface DashboardChartsProps {
  dashboardData: IDashboardOverview;
}

const COLORS = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  completed: '#10b981',
  cancelled: '#ef4444',
};

export function DashboardCharts({ dashboardData }: DashboardChartsProps) {
  const orderStatsData = [
    { name: 'Pending', value: dashboardData?.orderStats?.PENDING ?? "", fill: COLORS.pending },
    { name: 'Confirmed', value: dashboardData?.orderStats?.CONFIRMED, fill: COLORS.confirmed },
    { name: 'Completed', value: dashboardData?.orderStats?.COMPLETED, fill: COLORS.completed },
    { name: 'Cancelled', value: dashboardData?.orderStats?.CANCELLED, fill: COLORS.cancelled },
  ];

  const chartData = [
    { month: 'Jan', orders: 400, revenue: 2400 },
    { month: 'Feb', orders: 300, revenue: 1398 },
    { month: 'Mar', orders: 200, revenue: 9800 },
    { month: 'Apr', orders: 278, revenue: 3908 },
    { month: 'May', orders: 189, revenue: 4800 },
    { month: 'Jun', orders: 239, revenue: 3800 },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Order Status Pie Chart */}
      <Card className="border-amber-200/40 bg-linear-to-br from-card via-card to-card/70 dark:border-amber-900/40 dark:from-card dark:via-card dark:to-card/50 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Order Status Distribution</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Orders by status
          </p>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={orderStatsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
                formatter={(value) => value?.toString()}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Orders & Revenue Bar Chart */}
      <Card className="border-amber-200/40 bg-linear-to-br from-card via-card to-card/70 dark:border-amber-900/40 dark:from-card dark:via-card dark:to-card/50 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Orders & Revenue Trend</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Last 6 months performance
          </p>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '0.875rem' }}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '0.875rem' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Bar dataKey="orders" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Revenue Trend Line Chart */}
      <Card className="border-amber-200/40 bg-linear-to-br from-card via-card to-card/70 dark:border-amber-900/40 dark:from-card dark:via-card dark:to-card/50 p-6 lg:col-span-2">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Revenue Analytics</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Detailed revenue breakdown over time
          </p>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '0.875rem' }}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '0.875rem' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
