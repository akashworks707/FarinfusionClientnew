'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Courier } from '@/types/courier';

interface CourierInfoProps {
  courier: Courier;
}

export function CourierInfo({ courier }: CourierInfoProps) {
  const [copied, setCopied] = useState(false);

  if (!courier.trackingCode || !courier.courierName) {
    return null;
  }

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(courier?.trackingCode || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-green-200 dark:border-green-900/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Truck className="h-4 w-4" />
            Courier Information
          </CardTitle>
          <Badge>{courier.courierName}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Tracking Number</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-muted px-3 py-2 font-mono text-sm">
              {courier.trackingCode}
            </code>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopyTracking}
              className="h-8 w-8"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Delivery Status</p>
          <p className="font-medium capitalize">{courier?.deliveryStatus.replace(/_/g, ' ')}</p>
        </div>
      </CardContent>
    </Card>
  );
}
