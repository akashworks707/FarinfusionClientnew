"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, FileText, Tag } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BrandDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand?: {
    title: string;
    slug?: string;
    description?: string;
    status?: "ACTIVE" | "INACTIVE";
    image?: string;
    createdAt?: string;
  };
}

export default function BrandDetailsModal({open, onOpenChange, brand,}: BrandDetailsModalProps) {
  if (!brand) return null;

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-6 sm:p-6 sm:max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Accent line */}
          <div className="w-full" />

          <Card className="shadow-lg">
            <CardContent>
              <CardHeader className="text-center mb-2">
                <CardTitle className="text-2xl font-bold tracking-wide uppercase">
                  Brand Details
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Detailed information about the selected brand
                </CardDescription>
              </CardHeader>

              <Separator className="my-3" />

              {/* Brand Image */}
              <div className="flex justify-center mb-6">
                {brand.image ? (
                    <Image
                        src={brand.image}
                        alt={brand.title}
                        width={200}
                        height={200}
                        className="rounded-xl object-cover shadow-md"
                    />
                ) : (
                    <div className="w-32 h-32 rounded-xl bg-muted flex items-center justify-center shadow-inner">
                      <Tag className="w-10 h-10 text-muted-foreground" />
                    </div>
                )}
              </div>

              <Separator className="my-3" />

              {/* Brand Info */}
              <div className="space-y-4">
                {/* Title */}
                <div className={"flex items-center gap-5"}>
                  <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    Title
                  </p>
                  :
                  <p className="text-sm">{brand.title}</p>
                </div>

                <Separator className="my-3" />

                {/* Description */}
                {brand.description && (
                    <div className={"flex items-center gap-5"}>
                      <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                        Description
                      </p>
                      :
                      <p className="text-sm">{brand.description}</p>
                    </div>
                )}

                <Separator className="my-3" />

                {/* Status */}
                {brand.status && (
                    <div className={"flex items-center gap-5"}>
                      <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                        Status
                      </p>
                      :
                      <Badge
                          variant={brand.status === "ACTIVE" ? "default" : "destructive"}
                      >
                        {brand.status}
                      </Badge>
                    </div>
                )}

                <Separator className="my-3" />

                {/* Created At */}
                {brand.createdAt && (
                    <div className={"flex items-center gap-5"}>
                      <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                        Created At
                      </p>
                      :
                      <div className="text-sm flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-muted-foreground" />
                        {new Date(brand.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Close Button */}
          <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
  );
}