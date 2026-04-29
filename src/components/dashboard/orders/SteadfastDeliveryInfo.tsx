'use client';

import { Truck, Package, Clock, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SteadfastDeliveryInfoProps {
  showDetails?: boolean;
}

const STEADFAST_FEATURES = [
  {
    icon: Truck,
    title: 'Express Delivery',
    description: 'Fast and reliable courier service across the region',
  },
  {
    icon: Package,
    title: 'Real-time Tracking',
    description: 'Track your shipment in real-time with live updates',
  },
  {
    icon: Clock,
    title: 'Quick Pickup',
    description: 'Automatic pickup arrangement within 24 hours',
  },
  {
    icon: Shield,
    title: 'Secure & Insured',
    description: 'All shipments are insured and handled securely',
  },
];

export function SteadfastDeliveryInfo({ showDetails = true }: SteadfastDeliveryInfoProps) {
  if (!showDetails) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-900/20">
        <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
          Steadfast Delivery Available
        </span>
      </div>
    );
  }

  return (
    <Card className="border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Steadfast Delivery Service
        </CardTitle>
        <CardDescription>Professional courier service with full tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {STEADFAST_FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="flex gap-3">
                <Icon className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">
            By selecting Steadfast, your order will be automatically picked up and shipped with
            real-time tracking updates provided to the customer.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
