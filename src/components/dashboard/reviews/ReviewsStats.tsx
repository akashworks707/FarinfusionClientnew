"use client"

import { Star, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IReviewStats } from "@/types/types.review";

interface ReviewsStatsProps {
  stats: IReviewStats | undefined;
  isLoading: boolean;
}

export function ReviewsStats({ stats, isLoading }: ReviewsStatsProps) {
  const statsConfig = [
    {
      title: "Total Reviews",
      value: stats?.totalReviews || 0,
      icon: Star,
      color: "amber",
    },
    {
      title: "Approved",
      value: stats?.approvedReviews || 0,
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Pending",
      value: stats?.pendingReviews || 0,
      icon: Clock,
      color: "blue",
    },
    {
      title: "Rejected",
      value: stats?.rejectedReviews || 0,
      icon: XCircle,
      color: "red",
    },
    {
      title: "Average Rating",
      value: (stats?.averageRating || 0).toFixed(1),
      icon: Star,
      color: "purple",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statsConfig.map((_, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12 mb-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statsConfig.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Card key={idx} className={`border-l-4 border-l-${stat.color}-500`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center justify-between">
                <span>{stat.title}</span>
                <Icon className={`h-4 w-4 text-${stat.color}-600`} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold p-2 rounded`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
