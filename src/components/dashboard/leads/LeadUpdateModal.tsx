"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useGetSingleLeadQuery,
  useUpdateLeadMutation,
} from "@/redux/features/lead/lead.api";
import { Textarea } from "@/components/ui/textarea";
import LeadDetailSkeleton from "@/components/dashboard/leads/LeadDetailSkeleton";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Activity,
  StickyNote,
  PencilLine,
  Check,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";

enum LeadStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  QUALIFIED = "QUALIFIED",
  WON = "WON",
  LOST = "LOST",
  INACTIVE = "INACTIVE",
}

enum LeadPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

const STATUS_COLORS: Record<string, string> = {
  NEW: "text-blue-600 dark:text-blue-400",
  CONTACTED: "text-amber-600 dark:text-amber-400",
  QUALIFIED: "text-violet-600 dark:text-violet-400",
  WON: "text-emerald-600 dark:text-emerald-400",
  LOST: "text-red-600 dark:text-red-400",
  INACTIVE: "text-gray-500 dark:text-gray-400",
};

// Priority config with dot color + label color
const PRIORITY_CONFIG: Record<
  string,
  { label: string; dot: string; cls: string }
> = {
  HIGH: {
    label: "High",
    dot: "bg-red-500",
    cls: "text-red-600 dark:text-red-400",
  },
  MEDIUM: {
    label: "Medium",
    dot: "bg-amber-500",
    cls: "text-amber-600 dark:text-amber-400",
  },
  LOW: {
    label: "Low",
    dot: "bg-emerald-500",
    cls: "text-emerald-600 dark:text-emerald-400",
  },
};

const LeadUpdateSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(11, "Please enter a valid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  status: z.string().optional(),
  priority: z.string().optional(),
  notes: z.string().optional(),
});

type LeadFormData = z.infer<typeof LeadUpdateSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string | null;
};

function FormField({
  icon: Icon,
  label,
  htmlFor,
  error,
  children,
}: {
  icon: React.ElementType;
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={htmlFor}
        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
      >
        <Icon className="h-3 w-3" />
        {label}
      </Label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[11px] font-medium text-red-500 dark:text-red-400">
          <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls =
  "h-9 rounded-lg border-gray-200 bg-gray-50/60 text-sm transition-colors placeholder:text-gray-400 focus:border-amber-400 focus:bg-white dark:border-gray-700 dark:bg-gray-800/60 dark:placeholder:text-gray-600 dark:focus:border-amber-500 dark:focus:bg-gray-800";

const LeadUpdateModal = ({ open, onOpenChange, leadId }: Props) => {
  const { data, isLoading } = useGetSingleLeadQuery(leadId!, {
    skip: !leadId,
  });

  const [updateLead, { isLoading: isUpdating }] = useUpdateLeadMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<LeadFormData>({
    resolver: zodResolver(LeadUpdateSchema),
  });

  useEffect(() => {
    if (data?.data) {
      reset({
        name: data.data.name || "",
        email: data.data.email || "",
        phone: data.data.phone || "",
        address: data.data.address || "",
        notes: data.data.notes || "",
        status: data.data.status || "",
        priority: data.data.priority || "MEDIUM",
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: LeadFormData) => {
    if (!leadId) return;
    try {
      await updateLead({ id: leadId, data: formData }).unwrap();
      onOpenChange(false);
      toast.success("Lead updated successfully");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update lead");
    }
  };

  const handleCancel = () => {
    if (data?.data) {
      reset({
        name: data.data.name || "",
        email: data.data.email || "",
        phone: data.data.phone || "",
        address: data.data.address || "",
        notes: data.data.notes || "",
        status: data.data.status || "",
        priority: data.data.priority || "MEDIUM",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-115 gap-0 p-0 overflow-hidden rounded-2xl border-gray-200/80 dark:border-gray-700/60">
        {/* Accent bar */}
        <div className="h-1 w-full bg-linear-to-r from-amber-500 via-yellow-500 to-indigo-500" />

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
            <PencilLine className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <DialogTitle className="text-base font-bold text-gray-900 dark:text-gray-50">
              Update Lead
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-400 dark:text-gray-500">
              Edit lead information below
            </DialogDescription>
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          {isLoading ? (
            <LeadDetailSkeleton />
          ) : (
            <form
              id="lead-update-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* Name + Email row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  icon={User}
                  label="Full Name"
                  htmlFor="name"
                  error={errors.name?.message}
                >
                  <Input
                    id="name"
                    placeholder="e.g. Rahim Hossain"
                    className={inputCls}
                    {...register("name")}
                  />
                </FormField>

                <FormField
                  icon={Mail}
                  label="Email"
                  htmlFor="email"
                  error={errors.email?.message}
                >
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    className={inputCls}
                    {...register("email")}
                  />
                </FormField>
              </div>

              {/* Phone + Status row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  icon={Phone}
                  label="Phone"
                  htmlFor="phone"
                  error={errors.phone?.message}
                >
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    className={inputCls}
                    {...register("phone")}
                  />
                </FormField>

                <FormField
                  icon={Activity}
                  label="Status"
                  htmlFor="status"
                  error={errors.status?.message}
                >
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        key={field.value}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="status"
                          className={cn(inputCls, "w-full")}
                        >
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(LeadStatus).map((s) => (
                            <SelectItem key={s} value={s}>
                              <span
                                className={cn("font-medium", STATUS_COLORS[s])}
                              >
                                {s.charAt(0) + s.slice(1).toLowerCase()}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
              </div>

              {/* Address + Priority row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  icon={MapPin}
                  label="Address"
                  htmlFor="address"
                  error={errors.address?.message}
                >
                  <Input
                    id="address"
                    placeholder="House no., Road, Area, City"
                    className={inputCls}
                    {...register("address")}
                  />
                </FormField>

                {/* Priority select */}
                <FormField
                  icon={Flag}
                  label="Priority"
                  htmlFor="priority"
                  error={errors.priority?.message}
                >
                  <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                      <Select
                        key={field.value}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="priority"
                          className={cn(inputCls, "w-full")}
                        >
                          <SelectValue placeholder="Select priority">
                            {field.value && PRIORITY_CONFIG[field.value] && (
                              <span className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "h-2 w-2 rounded-full shrink-0",
                                    PRIORITY_CONFIG[field.value].dot,
                                  )}
                                />
                                <span
                                  className={cn(
                                    "font-medium",
                                    PRIORITY_CONFIG[field.value].cls,
                                  )}
                                >
                                  {PRIORITY_CONFIG[field.value].label}
                                </span>
                              </span>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(LeadPriority).map((p) => {
                            const cfg = PRIORITY_CONFIG[p];
                            return (
                              <SelectItem key={p} value={p}>
                                <span className="flex items-center gap-2">
                                  <span
                                    className={cn(
                                      "h-2 w-2 rounded-full shrink-0",
                                      cfg.dot,
                                    )}
                                  />
                                  <span
                                    className={cn("font-medium", cfg.cls)}
                                  >
                                    {cfg.label}
                                  </span>
                                </span>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
              </div>

              {/* Notes */}
              <FormField
                icon={StickyNote}
                label="Notes"
                htmlFor="notes"
                error={errors.notes?.message}
              >
                <Textarea
                  id="notes"
                  placeholder="Add any relevant notes about this lead…"
                  rows={3}
                  className={cn(inputCls, "h-auto resize-none leading-relaxed")}
                  {...register("notes")}
                />
              </FormField>
            </form>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="flex gap-2 items-center my-1 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
          <DialogClose asChild>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="submit"
            form="lead-update-form"
            size="sm"
            disabled={isUpdating || !isDirty}
            className={cn(
              "hover:cursor-pointer group relative overflow-hidden rounded-lg",
              "bg-amber-600 text-white hover:bg-amber-700",
              "dark:bg-amber-700 dark:hover:bg-amber-600",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-200 active:scale-95",
            )}
          >
            {/* shimmer */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[200%]"
            />
            {isUpdating ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Updating…
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" />
                Save Changes
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeadUpdateModal;
