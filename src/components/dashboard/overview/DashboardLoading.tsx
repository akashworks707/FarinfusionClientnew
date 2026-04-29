'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

export function DashboardLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-96 animate-pulse rounded-lg bg-muted/70" />
      </div>

      {/* Filters Skeleton */}
      <Card className="border-amber-200/40 bg-linear-to-br from-card via-card to-card/70 dark:border-amber-900/40 dark:from-card dark:via-card dark:to-card/50 p-6">
        <div className="space-y-4">
          <div className="h-5 w-32 animate-pulse rounded-lg bg-muted" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-muted/70" />
            ))}
          </div>
        </div>
      </Card>

      {/* Stats Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card
            key={i}
            className="border-amber-200/40 bg-linear-to-br from-card via-card to-card/70 dark:border-amber-900/40 dark:from-card dark:via-card dark:to-card/50 p-5"
          >
            <div className="space-y-3">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-8 w-32 animate-pulse rounded bg-muted" />
              <div className="h-3 w-28 animate-pulse rounded bg-muted/70" />
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card
            key={i}
            className="border-amber-200/40 bg-linear-to-br from-card via-card to-card/70 dark:border-amber-900/40 dark:from-card dark:via-card dark:to-card/50 p-6"
          >
            <div className="space-y-4">
              <div className="h-5 w-40 animate-pulse rounded bg-muted" />
              <div className="h-64 animate-pulse rounded-lg bg-muted/70" />
            </div>
          </Card>
        ))}
      </div>

      {/* Tables Skeleton */}
      <Card className="border-amber-200/40 bg-linear-to-br from-card via-card to-card/70 dark:border-amber-900/40 dark:from-card dark:via-card dark:to-card/50 p-6">
        <div className="space-y-4">
          <div className="h-5 w-40 animate-pulse rounded bg-muted" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-muted/70" />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
