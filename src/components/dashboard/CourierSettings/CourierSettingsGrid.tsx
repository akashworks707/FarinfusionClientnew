"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Truck,
  MapPin,
  Globe,
  TestTube2,
  Zap,
  Power,
  PowerOff,
  Settings2,
  ArrowRight,
  Shield,
  Activity,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";
import type { CourierSettings } from "@/types/courierSettings";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CourierSettingsGridProps {
  data: CourierSettings[];
  isLoading?: boolean;
  onEdit?: (settings: CourierSettings) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  onView?: (settings: CourierSettings) => void;
}

const PROVIDER_STYLES: Record<
  string,
  {
    linear: string;
    border: string;
    badge: string;
    icon: string;
    glow: string;
  }
> = {
  STEADFAST: {
    linear: "from-amber-500/15 via-orange-500/8 to-transparent",
    border: "border-amber-300/60 dark:border-amber-700/50",
    badge:
      "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-700",
    icon: "🚚",
    glow: "group-hover:shadow-amber-200/50 dark:group-hover:shadow-amber-900/40",
  },
  PAPERFLY: {
    linear: "from-blue-500/15 via-cyan-500/8 to-transparent",
    border: "border-blue-300/60 dark:border-blue-700/50",
    badge:
      "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-700",
    icon: "✈️",
    glow: "group-hover:shadow-blue-200/50 dark:group-hover:shadow-blue-900/40",
  },
  PATHAO: {
    linear: "from-rose-500/15 via-pink-500/8 to-transparent",
    border: "border-rose-300/60 dark:border-rose-700/50",
    badge:
      "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-900/30 dark:text-rose-200 dark:border-rose-700",
    icon: "🛵",
    glow: "group-hover:shadow-rose-200/50 dark:group-hover:shadow-rose-900/40",
  },
  REDX: {
    linear: "from-red-500/15 via-orange-500/8 to-transparent",
    border: "border-red-300/60 dark:border-red-700/50",
    badge:
      "bg-red-100 text-red-900 border-red-300 dark:bg-red-900/30 dark:text-red-200 dark:border-red-700",
    icon: "⚡",
    glow: "group-hover:shadow-red-200/50 dark:group-hover:shadow-red-900/40",
  },
  ECOURIER: {
    linear: "from-emerald-500/15 via-teal-500/8 to-transparent",
    border: "border-emerald-300/60 dark:border-emerald-700/50",
    badge:
      "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-700",
    icon: "📦",
    glow: "group-hover:shadow-emerald-200/50 dark:group-hover:shadow-emerald-900/40",
  },
  SUNDARBAN: {
    linear: "from-violet-500/15 via-purple-500/8 to-transparent",
    border: "border-violet-300/60 dark:border-violet-700/50",
    badge:
      "bg-violet-100 text-violet-900 border-violet-300 dark:bg-violet-900/30 dark:text-violet-200 dark:border-violet-700",
    icon: "🌿",
    glow: "group-hover:shadow-violet-200/50 dark:group-hover:shadow-violet-900/40",
  },
  CUSTOM: {
    linear: "from-slate-500/15 via-gray-500/8 to-transparent",
    border: "border-slate-300/60 dark:border-slate-700/50",
    badge:
      "bg-slate-100 text-slate-900 border-slate-300 dark:bg-slate-800/60 dark:text-slate-200 dark:border-slate-700",
    icon: "🔧",
    glow: "group-hover:shadow-slate-200/50 dark:group-hover:shadow-slate-900/40",
  },
};

const DEFAULT_STYLE = PROVIDER_STYLES.CUSTOM;

function isSecretKey(key: string): boolean {
  const lower = key.toLowerCase();
  return (
    lower.includes("secret") ||
    lower.includes("token") ||
    lower.includes("key") ||
    lower.includes("username") ||
    lower.includes("password")
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-16 rounded bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>
        <div className="h-7 w-7 rounded-lg bg-gray-100 dark:bg-gray-800" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full rounded bg-gray-100 dark:bg-gray-800" />
        <div className="h-3 w-3/4 rounded bg-gray-100 dark:bg-gray-800" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="h-6 w-14 rounded-full bg-gray-100 dark:bg-gray-800" />
      </div>
    </div>
  );
}

interface CourierCardProps {
  setting: CourierSettings;
  onEdit?: (s: CourierSettings) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  onView?: (s: CourierSettings) => void;
}

function CourierCard({
  setting,
  onEdit,
  onDelete,
  onToggleStatus,
  onView,
}: CourierCardProps) {
  const [showSecrets, setShowSecrets] = useState<Record<number, boolean>>({});

  const toggleSecret = (i: number) =>
    setShowSecrets((prev) => ({ ...prev, [i]: !prev[i] }));

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(setting.config, null, 2));
    toast.success("Configuration copied to clipboard");
  };

  const style = PROVIDER_STYLES[setting.provider] ?? DEFAULT_STYLE;
  const configEntries = Object.entries(setting.config || {});

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-white",
        "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl",
        "dark:bg-gray-900/80",
        style.border,
        style.glow,
      )}
    >
      {/* Top linear wash */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-32 bg-linear-to-b pointer-events-none",
          // style.linear,
        )}
      />

      <div
        className={cn(
          "absolute left-0 top-4 bottom-4 w-0.75 rounded-r-full transition-all duration-300",
          setting.isActive ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700",
        )}
      />

      <div className="relative flex flex-col flex-1 p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl",
                "border bg-white shadow-sm dark:bg-gray-800",
                style.border,
              )}
            >
              {style.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-50 leading-snug">
                {setting.displayName}
              </h3>
              <Badge
                variant="outline"
                className={cn(
                  "mt-1 text-[10px] font-bold px-2 py-0",
                  style.badge,
                )}
              >
                {setting.provider}
              </Badge>
            </div>
          </div>

          {/* Actions menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 rounded-lg opacity-60 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-opacity"
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              {onView && (
                <>
                  <DropdownMenuItem
                    onClick={() => onView(setting)}
                    className="gap-2 cursor-pointer text-sm"
                  >
                    <Eye className="h-3.5 w-3.5" /> View Details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {onEdit && (
                <DropdownMenuItem
                  onClick={() => onEdit(setting)}
                  className="gap-2 cursor-pointer text-sm"
                >
                  <Edit className="h-3.5 w-3.5" /> Edit Settings
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={handleCopyConfig}
                className="gap-2 cursor-pointer text-sm"
              >
                <Copy className="h-3.5 w-3.5" /> Copy Config
              </DropdownMenuItem>
              {onToggleStatus && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onToggleStatus(setting._id)}
                    className="gap-2 cursor-pointer text-sm"
                  >
                    {setting.isActive ? (
                      <>
                        <PowerOff className="h-3.5 w-3.5 text-orange-500" />{" "}
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Power className="h-3.5 w-3.5 text-emerald-500" />{" "}
                        Activate
                      </>
                    )}
                  </DropdownMenuItem>
                </>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(setting._id)}
                    className="gap-2 cursor-pointer text-sm text-rose-600 focus:text-rose-600 dark:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status pills */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold",
              setting.isActive
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
            )}
          >
            <Activity className="h-2.5 w-2.5" />
            {setting.isActive ? "Active" : "Inactive"}
          </span>

          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold",
              setting.isSandbox
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-400",
            )}
          >
            {setting.isSandbox ? (
              <>
                <TestTube2 className="h-2.5 w-2.5" /> Sandbox
              </>
            ) : (
              <>
                <Globe className="h-2.5 w-2.5" /> Live
              </>
            )}
          </span>

          {configEntries.length > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
              <Settings2 className="h-2.5 w-2.5" />
              {configEntries.length} key{configEntries.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Info rows */}
        <div className="space-y-2 flex-1">
          {/* Pickup info */}
          {setting.pickupInfo?.name && (
            <div className="flex items-start gap-2 rounded-lg bg-gray-50/80 px-3 py-2 dark:bg-gray-800/50">
              <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 truncate">
                  {setting.pickupInfo.name}
                </p>
                {(setting.pickupInfo.area || setting.pickupInfo.city) && (
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                    {[setting.pickupInfo.area, setting.pickupInfo.city]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Webhook URL */}
          {setting.webhookUrl && (
            <div className="flex items-center gap-2 rounded-lg bg-gray-50/80 px-3 py-2 dark:bg-gray-800/50">
              <Zap className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                Webhook configured
              </p>
            </div>
          )}

          {/* Notes */}
          {setting.notes && (
            <div className="flex items-start gap-2 rounded-lg bg-gray-50/80 px-3 py-2 dark:bg-gray-800/50">
              <Shield className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
              <p className="line-clamp-1 text-[11px] text-gray-500 dark:text-gray-400">
                {setting.notes}
              </p>
            </div>
          )}

          {configEntries.length > 0 && (
            <div className="mt-1 space-y-1.5">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-1">
                <KeyRound className="h-2.5 w-2.5" />
                Credentials
              </p>
              {configEntries.map(([key, value], i) => {
                const secret = isSecretKey(key);
                const revealed = showSecrets[i] ?? false;

                return (
                  <div
                    key={key}
                    className="flex items-center gap-2 rounded-lg border border-gray-100 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-800/40"
                  >
                    {/* Key label */}
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 w-24 truncate">
                      {key}
                    </span>

                    {/* Value — masked or plain */}
                    <span
                      className={cn(
                        "flex-1 truncate font-mono text-[11px]",
                        secret && !revealed
                          ? "text-gray-300 dark:text-gray-600 tracking-[0.25em]"
                          : "text-gray-700 dark:text-gray-300",
                      )}
                    >
                      {secret && !revealed
                        ? "•".repeat(Math.min(value.length, 14))
                        : value}
                    </span>

                    {/* Toggle only on secret keys */}
                    {secret && (
                      <button
                        type="button"
                        onClick={() => toggleSecret(i)}
                        className="shrink-0 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-amber-600 dark:hover:bg-gray-700 dark:hover:text-amber-400"
                        aria-label={revealed ? "Hide value" : "Show value"}
                      >
                        {revealed ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            Updated {format(new Date(setting.updatedAt), "MMM dd, yyyy")}
          </span>

          {onView && (
            <button
              onClick={() => onView(setting)}
              className={cn(
                "group/btn inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5",
                "text-[11px] font-semibold transition-all duration-200",
                "text-gray-500 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400",
                "hover:bg-amber-50 dark:hover:bg-amber-900/20",
              )}
            >
              View
              <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function CourierSettingsGrid({
  data,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus,
  onView,
}: CourierSettingsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <SkeletonCard key={i} />
          ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-20 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-900/20 mb-4">
          <Truck className="h-8 w-8 text-amber-400 dark:text-amber-600" />
        </div>
        <p className="text-base font-semibold text-gray-700 dark:text-gray-300">
          No courier providers configured
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Add your first courier provider to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {data.map((setting) => (
        <CourierCard
          key={setting._id}
          setting={setting}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          onView={onView}
        />
      ))}
    </div>
  );
}
