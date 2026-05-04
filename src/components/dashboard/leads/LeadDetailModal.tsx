"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Mail,
  PhoneIcon,
  MapPinIcon,
  ShoppingBagIcon,
  ArrowUpRight,
  UserRound,
  StickyNote,
  Flag,
  Activity,
  Globe,
} from "lucide-react";
import { useGetSingleLeadQuery } from "@/redux/features/lead/lead.api";
import LeadDetailSkeleton from "@/components/dashboard/leads/LeadDetailSkeleton";
import React from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa";


type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string | null;
};


const SOCIAL_MAP: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
  Facebook: {
    label: "Facebook",
    icon: <FaFacebookF className="h-3.5 w-3.5 text-blue-600" />,
    cls: "bg-blue-50 text-blue-600",
  },
  Instagram: {
    label: "Instagram",
    icon: <FaInstagram className="h-3.5 w-3.5 text-pink-500" />,
    cls: "bg-pink-50 text-pink-600",
  },
  Linkedin: {
    label: "LinkedIn",
    icon: <FaLinkedinIn className="h-3.5 w-3.5 text-sky-600" />,
    cls: "bg-sky-50 text-sky-600",
  },
  Youtube: {
    label: "YouTube",
    icon: <FaYoutube className="h-3.5 w-3.5 text-red-500" />,
    cls: "bg-red-50 text-red-600",
  },
  Whatsapp: {
    label: "WhatsApp",
    icon: <FaWhatsapp className="h-3.5 w-3.5 text-green-600" />,
    cls: "bg-green-50 text-green-600",
  },
  Tiktok: {
    label: "TikTok",
    icon: <FaTiktok className="h-3.5 w-3.5 text-black" />,
    cls: "bg-gray-100 text-black",
  },
};

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  NEW: {
    label: "New",
    cls: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  },
  CONTACTED: {
    label: "Contacted",
    cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  },
  QUALIFIED: {
    label: "Qualified",
    cls: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800",
  },
  CONVERTED: {
    label: "Converted",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  },
  LOST: {
    label: "Lost",
    cls: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  },
};

const PRIORITY_MAP: Record<string, { label: string; dot: string; cls: string }> = {
  HIGH: {
    label: "High",
    dot: "bg-red-500",
    cls: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  },
  MEDIUM: {
    label: "Medium",
    dot: "bg-amber-500",
    cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  },
  LOW: {
    label: "Low",
    dot: "bg-emerald-500",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  },
};

function LeadAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  const hue = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 360;

  return (
    <div
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white shadow-md"
      style={{ background: `hsl(${hue},52%,50%)` }}
    >
      {initials || <UserRound className="h-6 w-6" />}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-3 py-2.5", className)}>
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
          {label}
        </p>
        <div className="mt-0.5 text-sm font-medium text-gray-800 dark:text-gray-200">
          {value ?? <span className="text-gray-400 dark:text-gray-600 italic font-normal">—</span>}
        </div>
      </div>
    </div>
  );
}

export function LeadDetailModal({ open, onOpenChange, leadId }: Props) {
  const router = useRouter();

  const { data, isLoading, isError } = useGetSingleLeadQuery(leadId!, {
    skip: !leadId || !open,
  });

  const lead = data?.data;

   const social = SOCIAL_MAP[lead?.social ?? ""];
  const status = STATUS_MAP[lead?.status ?? "NEW"] ?? STATUS_MAP.NEW;
  const priority = PRIORITY_MAP[lead?.priority ?? "LOW"] ?? PRIORITY_MAP.LOW;

  const handleSell = () => {
    if (!lead) return;
    const params = new URLSearchParams({
      prefill: "1",
      name: lead.name ?? "",
      email: lead.email ?? "",
      phone: lead.phone ?? "",
      address: lead.address ?? "",
    });
    onOpenChange(false);
    router.push(`/staff/dashboard/pos?${params.toString()}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
    <ScrollArea className="max-h-[90vh] pr-4">
          <DialogContent className="sm:max-w-3xl p-0 overflow-hidden rounded-2xl border-gray-200/80 dark:border-gray-700/60">
        {/* ── Top accent bar ── */}
        <div className="h-1 w-full bg-linear-to-r from-blue-500 via-violet-500 to-emerald-500" />

        <div className="px-6 pt-5 pb-0">
          <DialogHeader>
            <DialogTitle className="sr-only">Lead Details</DialogTitle>
            <DialogDescription className="sr-only">
              View selected lead information.
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="pb-6">
              <LeadDetailSkeleton />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <div className="rounded-full bg-red-50 p-3 dark:bg-red-900/20">
                <Activity className="h-6 w-6 text-red-500" />
              </div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                Failed to load lead data
              </p>
            </div>
          ) : lead ? (
            <div className="pb-4">
              {/* ── Profile hero ── */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                <LeadAvatar name={lead.name ?? "?"} />
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-lg font-bold text-gray-900 dark:text-gray-50">
                    {lead.name}
                  </h2>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    {lead.email}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                        status.cls,
                      )}
                    >
                      {status.label}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                        priority.cls,
                      )}
                    >
                      <span
                        className={cn(
                          "mr-1 inline-block h-1.5 w-1.5 rounded-full",
                          priority.dot,
                        )}
                      />
                      {priority.label} Priority
                    </Badge>
                  </div>
                </div>
              </div>

              {/* ── Detail rows ── */}
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                <InfoRow icon={PhoneIcon} label="Phone" value={lead.phone} />
                <InfoRow icon={Mail} label="Email" value={lead.email} />
                <InfoRow icon={MapPinIcon} label="Address" value={lead.address} />
                <InfoRow
                  icon={Activity}
                  label="Status"
                  value={
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                        status.cls,
                      )}
                    >
                      {status.label}
                    </Badge>
                  }
                />
                <InfoRow
                  icon={Flag}
                  label="Priority"
                  value={
                    <div className="flex items-center gap-1.5">
                      <span className={cn("h-2 w-2 rounded-full", priority.dot)} />
                      {priority.label}
                    </div>
                  }
                />
                {lead.notes && (
                  <InfoRow
                    icon={StickyNote}
                    label="Notes"
                    value={
                      <span className="whitespace-pre-wrap leading-relaxed text-gray-600 dark:text-gray-400 font-normal">
                        {lead.notes}
                      </span>
                    }
                  />
                )}
                {lead.createdAt && (
                  <InfoRow
                    icon={Calendar}
                    label="Created"
                    value={new Date(lead.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  />
                )}
                {/* SOCIAL */}
                <InfoRow
                  icon={Globe}
                  label="Source"
                  value={
                    social ? (
                      <div className={`inline-flex items-center gap-2 px-2 py-1 rounded ${social.cls}`}>
                        {social.icon}
                        {social.label}
                      </div>
                    ) : (
                      <>
                        {lead?.social}
                      </>
                    )
                  }
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* ── Footer ── */}
        <DialogFooter className="flex gap-2 my-1 items-center border-t border-gray-100 px-6 py-4 dark:border-gray-800">
          <DialogClose asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none rounded-lg"
            >
              Close
            </Button>
          </DialogClose>

          {lead && (
            <button
              onClick={handleSell}
              className={cn(
                "group hover:cursor-pointer relative flex-1 sm:flex-none overflow-hidden",
                "inline-flex items-center justify-center gap-1.5 rounded-lg",
                "bg-emerald-600 px-4 py-2 text-sm font-semibold text-white",
                "transition-all duration-200",
                "hover:bg-emerald-700 hover:shadow-[0_2px_14px_--theme(--color-emerald-500/30%)]",
                "active:scale-95",
                "dark:bg-emerald-700 dark:hover:bg-emerald-600",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1",
              )}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[200%]"
              />
              <ShoppingBagIcon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-px group-hover:scale-110" />
              Sell to Lead
              <ArrowUpRight className="-translate-x-0.5 h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
            </button>
          )}
        </DialogFooter>
      </DialogContent>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
    </Dialog>
  );
}