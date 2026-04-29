/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Tag } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CategoryDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: any
}


export default function CategoryDetailsModal({open, onOpenChange, category} : CategoryDetailsModalProps) {
  // console.log(category)
  if (!category) return null;

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-6 sm:p-6 sm:max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Accent line */}
          <div className="w-full" />

          <Card className="shadow-lg">
            <CardContent>
              <CardHeader className="text-center mb-2">
                <CardTitle className="text-2xl font-bold tracking-wide uppercase">
                  Category Details
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Detailed information about the selected category
                </CardDescription>
              </CardHeader>

              <Separator className="my-3" />

              {/* category Image */}
              <div className="flex justify-center mb-6">
                {category.image ? (
                    <Image
                        src={category.image}
                        alt={category.title}
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

              {/* category Info */}
              <div className="space-y-4">
                {/* Title */}
                <div className={"flex items-center gap-5"}>
                  <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    Title
                  </p>
                  :
                  <p className="text-sm">{category.title}</p>
                </div>

                <Separator className="my-3" />

                {/* Description */}
                {category.description && (
                    <div className={"flex items-center gap-5"}>
                      <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                        Description
                      </p>
                      :
                      <p className="text-sm">{category.description}</p>
                    </div>
                )}

                <Separator className="my-3" />

                {/* showOrder */}
                {category.showOrder && (
                    <div className={"flex items-center gap-5"}>
                      <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                        Show Order
                      </p>
                      :
                      <p className="text-sm">{category.showOrder}</p>
                    </div>
                )}

                <Separator className="my-3" />

                {/* productCount */}
                {category.productCount && (
                    <div className={"flex items-center gap-5"}>
                      <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                        Product Count
                      </p>
                      :
                      <p className="text-sm">{category.productCount}</p>
                    </div>
                )}

                <Separator className="my-3" />

                {/* productCount */}
                {category.status && (
                    <div className={"flex items-center gap-5"}>
                      <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                        Status
                      </p>
                      :
                      <Badge
                          variant={category.status === "ACTIVE" ? "default" : "destructive"}
                      >
                        {category.status}
                      </Badge>
                    </div>
                )}

                <Separator className="my-3" />

                {/* Created At */}
                {category.createdAt && (
                    <div className={"flex items-center gap-5"}>
                      <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                        Created At
                      </p>
                      :
                      <div className="text-sm flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-muted-foreground" />
                        {new Date(category.createdAt).toLocaleDateString("en-US", {
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