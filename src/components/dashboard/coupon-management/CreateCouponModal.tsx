/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Tag,
  Percent,
  DollarSign,
  Calendar,
  Hash,
  ShoppingBag,
  ArrowDownCircle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useCreateCouponMutation,
  type CreateCouponPayload,
} from "@/redux/features/coupon/coupon.api";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const schema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").toUpperCase(),
  discountType: z.enum(["PERCENT", "FIXED"], {
    message: "Select discount type",
  }),
  discountValue: z.coerce.number().min(1, "Value must be at least 1"),
  minOrderAmount: z.coerce.number().min(0).optional(),
  maxDiscount: z.coerce.number().min(0).optional(),
  expiryDate: z.string().min(1, "Expiry date is required"),
  usageLimit: z.coerce.number().min(1).optional(),
});

type FormValues = z.infer<typeof schema>;

function FormField({
  icon: Icon,
  label,
  htmlFor,
  required,
  error,
  children,
  hint,
}: {
  icon: React.ElementType;
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={htmlFor}
        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400"
      >
        <Icon className="h-3 w-3 text-amber-500 dark:text-amber-400" />
        {label}
        {required && <span className="text-red-400">*</span>}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-[11px] text-gray-400 dark:text-gray-500">{hint}</p>
      )}
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
  "h-9 rounded-lg border-gray-200 bg-gray-50/60 text-sm transition-colors placeholder:text-gray-400 focus:border-amber-400 focus:bg-white dark:border-gray-700 dark:bg-gray-800/60 dark:placeholder:text-gray-600 dark:focus:border-amber-500 dark:focus:bg-gray-800 font-mono tracking-wider";

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(
    { length: 8 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
}

interface CreateCouponModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateCouponModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateCouponModalProps) {
  const [createCoupon, { isLoading }] = useCreateCouponMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      code: "",
      discountType: "PERCENT",
      discountValue: undefined,
      minOrderAmount: undefined,
      maxDiscount: undefined,
      expiryDate: "",
      usageLimit: undefined,
    },
  });

  const discountType = watch("discountType");

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const handleGenerate = () => {
    setValue("code", generateCode(), { shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    const payload: CreateCouponPayload = {
      code: data.code.toUpperCase(),
      discountType: data.discountType,
      discountValue: data.discountValue,
      expiryDate: new Date(data.expiryDate).toISOString(),
    };
    if (data.minOrderAmount) payload.minOrderAmount = data.minOrderAmount;
    if (data.maxDiscount && data.discountType === "PERCENT")
      payload.maxDiscount = data.maxDiscount;
    if (data.usageLimit) payload.usageLimit = data.usageLimit;

    try {
      const res = await createCoupon(payload).unwrap();
      if (res) {
        toast.success("Coupon created!", {
          description: `Code "${payload.code}" is ready to use.`,
        });
        onSuccess?.();
        onOpenChange(false);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create coupon");
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-125 gap-0 p-0 overflow-hidden rounded-2xl border-gray-200/80 dark:border-gray-700/60">
        {/* Amber accent bar */}
        <div className="h-1 w-full bg-linear-to-r from-amber-500 via-orange-400 to-yellow-400" />

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
            <Tag className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <DialogTitle className="text-base font-bold text-gray-900 dark:text-gray-50">
              Create Coupon
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-400 dark:text-gray-500">
              New discount code for customer orders
            </DialogDescription>
          </div>
        </div>

        {/* Body */}
        <ScrollArea className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <form
            id="create-coupon-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Code */}
            <FormField
              icon={Tag}
              label="Coupon Code"
              htmlFor="code"
              required
              error={errors.code?.message}
              hint="Min 3 characters. Auto-converts to uppercase."
            >
              <div className="flex gap-2">
                <Input
                  id="code"
                  placeholder="e.g. SAVE20"
                  className={cn(inputCls, "flex-1 uppercase")}
                  {...register("code")}
                  onChange={(e) =>
                    setValue("code", e.target.value.toUpperCase(), {
                      shouldValidate: true,
                    })
                  }
                />
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="hover:cursor-pointer flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] font-semibold text-gray-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-amber-700 dark:hover:text-amber-400 transition-colors"
                >
                  <RefreshCw className="h-3 w-3" />
                  Generate
                </button>
              </div>
            </FormField>

            {/* Discount type + value */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                icon={Percent}
                label="Discount Type"
                htmlFor="discountType"
                required
                error={errors.discountType?.message}
              >
                <Controller
                  control={control}
                  name="discountType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="discountType"
                        className={cn(inputCls, "w-full font-sans")}
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem
                          value="PERCENT"
                          className="cursor-pointer text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <Percent className="h-3.5 w-3.5 text-amber-500" />
                            Percentage (%)
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="FIXED"
                          className="cursor-pointer text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                            Fixed Amount (৳)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField
                icon={discountType === "PERCENT" ? Percent : DollarSign}
                label={discountType === "PERCENT" ? "Discount %" : "Discount ৳"}
                htmlFor="discountValue"
                required
                error={errors.discountValue?.message}
                hint={
                  discountType === "PERCENT"
                    ? "e.g. 20 = 20% off"
                    : "Fixed ৳ amount off"
                }
              >
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 select-none">
                    {discountType === "PERCENT" ? "%" : "৳"}
                  </span>
                  <Input
                    id="discountValue"
                    type="number"
                    min="1"
                    placeholder="0"
                    className={cn(inputCls, "pl-7")}
                    {...register("discountValue")}
                  />
                </div>
              </FormField>
            </div>

            {/* Min order + max discount (PERCENT only) */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                icon={ShoppingBag}
                label="Min Order (৳)"
                htmlFor="minOrderAmount"
                error={errors.minOrderAmount?.message}
                hint="Optional minimum"
              >
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 select-none">
                    ৳
                  </span>
                  <Input
                    id="minOrderAmount"
                    type="number"
                    min="0"
                    placeholder="0"
                    className={cn(inputCls, "pl-7")}
                    {...register("minOrderAmount")}
                  />
                </div>
              </FormField>

              {discountType === "PERCENT" ? (
                <FormField
                  icon={ArrowDownCircle}
                  label="Max Discount (৳)"
                  htmlFor="maxDiscount"
                  error={errors.maxDiscount?.message}
                  hint="Cap on % discount"
                >
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 select-none">
                      ৳
                    </span>
                    <Input
                      id="maxDiscount"
                      type="number"
                      min="0"
                      placeholder="No cap"
                      className={cn(inputCls, "pl-7")}
                      {...register("maxDiscount")}
                    />
                  </div>
                </FormField>
              ) : (
                <FormField
                  icon={Hash}
                  label="Usage Limit"
                  htmlFor="usageLimit"
                  error={errors.usageLimit?.message}
                  hint="How many times usable"
                >
                  <Input
                    id="usageLimit"
                    type="number"
                    min="1"
                    placeholder="1"
                    className={inputCls}
                    {...register("usageLimit")}
                  />
                </FormField>
              )}
            </div>

            {/* Usage limit (PERCENT only, shown here) */}
            {discountType === "PERCENT" && (
              <FormField
                icon={Hash}
                label="Usage Limit"
                htmlFor="usageLimit"
                error={errors.usageLimit?.message}
                hint="Total times this code can be used"
              >
                <Input
                  id="usageLimit"
                  type="number"
                  min="1"
                  placeholder="1 (default)"
                  className={inputCls}
                  {...register("usageLimit")}
                />
              </FormField>
            )}

            {/* Expiry date */}
            <FormField
              icon={Calendar}
              label="Expiry Date"
              htmlFor="expiryDate"
              required
              error={errors.expiryDate?.message}
              hint="Coupon becomes invalid after this date"
            >
              <Input
                id="expiryDate"
                type="date"
                min={minDate}
                className={cn(inputCls, "font-sans")}
                {...register("expiryDate")}
              />
            </FormField>

            {/* Preview card */}
            {watch("code") && watch("discountValue") > 0 && (
              <div className="rounded-xl border border-amber-200/60 bg-amber-50/40 p-3.5 dark:border-amber-900/30 dark:bg-amber-900/10">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-amber-600/70 dark:text-amber-500/70">
                  Preview
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="rounded-md bg-amber-100 px-2.5 py-1 text-sm font-bold tracking-widest text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    {watch("code") || "CODE"}
                  </code>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    →
                  </span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {discountType === "PERCENT"
                      ? `${watch("discountValue")}% off${watch("maxDiscount") ? ` (max ৳${watch("maxDiscount")})` : ""}`
                      : `৳${watch("discountValue")} off`}
                  </span>
                  {(watch("minOrderAmount") ?? 0) > 0 && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      · min order ৳{watch("minOrderAmount")}
                    </span>
                  )}
                </div>
              </div>
            )}

            <p className="text-[11px] text-gray-400 dark:text-gray-600">
              <span className="text-red-400">*</span> Required fields
            </p>
          </form>
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="flex mb-2 items-center gap-2 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
          <Button
            variant="outline"
            size="sm"
            className="hover:cursor-pointer rounded-lg"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <button
            type="submit"
            form="create-coupon-form"
            disabled={isLoading}
            className={cn(
              "hover:cursor-pointer group relative overflow-hidden inline-flex items-center gap-1.5",
              "rounded-lg px-4 py-2 text-sm font-semibold text-white",
              "bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500",
              "transition-all duration-200 active:scale-95",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1",
            )}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[200%]"
            />
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Creating…
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                Create Coupon
              </span>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
