/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateLeadMutation } from "@/redux/features/lead/lead.api";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  MapPin,
  StickyNote,
  UserPlus,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const LeadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().min(5, "Please enter a valid email address"),
  phone: z.string().min(11, "Please enter a valid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  notes: z.string().optional(),
});

type LeadFormData = z.infer<typeof LeadSchema>;

function FormField({
  icon: Icon,
  label,
  htmlFor,
  error,
  required,
  children,
}: {
  icon: React.ElementType;
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
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
        {required && <span className="text-red-400 ml-0.5">*</span>}
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

const LeadAddedModal = ({ open, onOpenChange }: Props) => {
  const [createLead, { isLoading }] = useCreateLeadMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(LeadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
    },
  });

  const onSubmit = async (formData: LeadFormData) => {
    try {
      
      await createLead({
        ...formData,
        email: formData.email ?? "",
        phone: formData.phone ?? "",
      }).unwrap();
      reset();
      onOpenChange(false);
      toast.success("Lead created successfully", {
        description: formData.name
          ? `${formData.name} has been added.`
          : undefined,
      });
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-115 gap-0 p-0 overflow-hidden rounded-2xl border-gray-200/80 dark:border-gray-700/60">
        {/* Accent bar */}
        <div className="h-1 w-full bg-linear-to-r from-amber-500 via-teal-500 to-cyan-500" />

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
            <UserPlus className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <DialogTitle className="text-base font-bold text-gray-900 dark:text-gray-50">
              Add New Lead
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-400 dark:text-gray-500">
              Fill in the lead&apos;s contact information
            </DialogDescription>
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <form
            id="lead-add-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Name + Email */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                icon={User}
                label="Full Name"
                htmlFor="name"
                required
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

            {/* Phone */}
            <FormField
              icon={Phone}
              label="Phone"
              htmlFor="phone"
              required
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

            {/* Address */}
            <FormField
              icon={MapPin}
              label="Address"
              htmlFor="address"
              required
              error={errors.address?.message}
            >
              <Input
                id="address"
                placeholder="House no., Road, Area, City"
                className={inputCls}
                {...register("address")}
              />
            </FormField>

            {/* Notes */}
            <FormField
              icon={StickyNote}
              label="Notes"
              htmlFor="notes"
              error={errors.notes?.message}
            >
              <Textarea
                id="notes"
                placeholder="Any additional notes about this lead… (optional)"
                rows={3}
                className={cn(inputCls, "h-auto resize-none leading-relaxed")}
                {...register("notes")}
              />
            </FormField>

            {/* Required hint */}
            <p className="text-[11px] text-gray-400 dark:text-gray-600">
              <span className="text-red-400">*</span> Required fields
            </p>
          </form>
        </div>

        {/* Footer */}
        <DialogFooter className="flex items-center my-1 gap-2 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
          <DialogClose asChild>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={() => reset()}
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="submit"
            form="lead-add-form"
            size="sm"
            disabled={isLoading}
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
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Adding…
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Add Lead
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeadAddedModal;
