"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  Phone,
  User,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  Shield,
} from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";

interface UserDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
    isActive?: boolean | string;
    isDeleted?: boolean;
    isVerified?: boolean;
    createdAt?: string;
    location?: string;
    address?: string;
    picture?: string;
  };
}

const roleColors: Record<string, { bg: string; text: string; badge: string }> =
  {
    ADMIN: {
      bg: "bg-purple-50 dark:bg-purple-950/20",
      text: "text-purple-700 dark:text-purple-300",
      badge:
        "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
    },
    MANAGER: {
      bg: "bg-blue-50 dark:bg-blue-950/20",
      text: "text-blue-700 dark:text-blue-300",
      badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
    },
    MODERATOR: {
      bg: "bg-amber-50 dark:bg-amber-950/20",
      text: "text-amber-700 dark:text-amber-300",
      badge:
        "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
    },
    CUSTOMER: {
      bg: "bg-green-50 dark:bg-green-950/20",
      text: "text-green-700 dark:text-green-300",
      badge:
        "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
    },
  };

const UserDetailsModal = ({
  open,
  onOpenChange,
  user,
}: UserDetailsModalProps) => {
  if (!user) return null;

  const roleData = roleColors[user.role || "CUSTOMER"] || roleColors.CUSTOMER;
  const getRoleIcon = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "👑";
      case "MANAGER":
        return "📊";
      case "MODERATOR":
        return "⚙️";
      default:
        return "👤";
    }
  };

  const detailItems = [
    {
      icon: User,
      label: "Name",
      value: user.name || "N/A",
      color: "text-slate-600 dark:text-slate-400",
    },
    {
      icon: Mail,
      label: "Email",
      value: user.email || "N/A",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Phone,
      label: "Phone",
      value: user.phone || "N/A",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: MapPin,
      label: "Address",
      value: user.address || user.location || "N/A",
      color: "text-orange-600 dark:text-orange-400",
    },
  ];

  const statusItems = [
    {
      icon: Shield,
      label: "Role",
      value: user.role || "CUSTOMER",
      badge: true,
      color: roleData.text,
    },
    {
      icon: CheckCircle,
      label: "Status",
      value: user.isActive ? "Active" : "Inactive",
      badge: true,
      badgeClass: user.isActive
        ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
    },
    {
      icon: user.isVerified ? CheckCircle : XCircle,
      label: "Verified",
      value: user.isVerified ? "Yes" : "No",
      badge: true,
      badgeClass: user.isVerified
        ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
        : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300",
    },
    {
      icon: user.isDeleted ? XCircle : CheckCircle,
      label: "Account Status",
      value: user.isDeleted ? "Deleted" : "Active",
      badge: true,
      badgeClass: user.isDeleted
        ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
        : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
    },
    {
      icon: Calendar,
      label: "Joined Date",
      value: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "N/A",
      color: "text-yellow-600 dark:text-yellow-400",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-linear-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-950 p-0 overflow-hidden">
        {/* Header with Role Background */}
        <ScrollArea className="max-h-[70vh] pr-2">
          <DialogHeader
            className={`${roleData.bg} px-6 py-5 border-b border-gray-200 dark:border-gray-700`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{getRoleIcon(user.role)}</div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-foreground">
                    {user.name}
                  </DialogTitle>
                  <DialogDescription className="text-sm mt-1">
                    User Profile Information
                  </DialogDescription>
                </div>
              </div>
              {user.picture && (
                <Image
                  width={500}
                  height={500}
                  src={user.picture}
                  alt={user?.name ?? "User Profile Picture"}
                  priority
                  quality={90}
                  className="h-16 w-16 rounded-lg object-cover border-2 border-white dark:border-gray-700 shadow-md"
                />
              )}
            </div>
          </DialogHeader>

          <div className="px-6 py-6 space-y-6">
            {/* Role Badge Highlight */}
            <div
              className={`${roleData.bg} border border-gray-200 dark:border-gray-700 rounded-lg p-4`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Current Role & Status
                </p>
                <Badge className={roleData.badge}>
                  {user.role || "CUSTOMER"}
                </Badge>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Information
              </h3>
              <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800/50">
                <CardContent className="p-4 space-y-3">
                  {detailItems.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className={`h-4 w-4 ${item.color}`} />
                          <span className="text-sm font-medium text-muted-foreground">
                            {item.label}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          {item.value}
                        </span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Account Details */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Account Details
              </h3>
              <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800/50">
                <CardContent className="p-4 space-y-3">
                  {statusItems.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className={`h-4 w-4 ${item.color}`} />
                          <span className="text-sm font-medium text-muted-foreground">
                            {item.label}
                          </span>
                        </div>
                        {item.badge ? (
                          <Badge className={item.badgeClass || roleData.badge}>
                            {item.value}
                          </Badge>
                        ) : (
                          <span className="text-sm font-semibold text-foreground">
                            {item.value}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Footer */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-3">
              <p className="text-xs text-amber-900 dark:text-amber-100">
                <span className="font-semibold">Last Updated:</span>{" "}
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        {/* Close Button */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-slate-900/30 flex justify-end">
          <DialogClose asChild>
            <Button className="bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium transition-all hover:shadow-lg active:scale-95">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
