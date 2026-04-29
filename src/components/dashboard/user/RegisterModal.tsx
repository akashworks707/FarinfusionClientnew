/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff, Plus, Upload, X } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// import logo from "../../../../public/assets/FRN-Logo-scaled.webp";
import { registerUser } from "@/utils/registerUser";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  MODERATOR = "MODERATOR",
  TELLICELSS = "TELLICELSS",
  GENERALSTAFF = "GENERALSTAFF",
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const signupSchema = z
  .object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string({ message: "Phone Number must be string" })
      .regex(/^(?:\+880|0)[1-9]\d{7,9}$/, {
        message:
          "Phone number must be valid for Bangladesh. Format: +88XXXXXXXXX or 0XXXXXXXXX",
      }),
    address: z.string().min(5, "Address must be at least 5 characters"),
    salary: z.preprocess((val) => {
      if (val === "" || val === undefined || val === null) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    }, z.number().min(0, "Salary must be a positive number").optional()),
    commissionSalary: z.preprocess((val) => {
      if (val === "" || val === undefined || val === null) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    }, z.number().min(0, "Salary must be a positive number").optional()),
    role: z.nativeEnum(Role, { message: "Please select a role" }),
    password: z
      .string({ message: "Password must be string" })
      .min(8, { message: "Password must be at least 8 characters long." }),
    confirmPassword: z
      .string({ message: "Password must be string" })
      .min(8, { message: "Password must be at least 8 characters long." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

// ─── Password Field Helper ────────────────────────────────────────────────────

function PasswordField({
  id,
  placeholder,
  registration,
  error,
}: {
  id: string;
  placeholder: string;
  registration: object;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        {...registration}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegisterModal({ refetch }: any) {
  const [open, setOpen] = useState(false);
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      salary: undefined,
      commissionSalary: undefined,
      role: undefined,
      password: "",
      confirmPassword: "",
    },
  });

  // ── File change handler ──
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 2MB limit
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    setPictureFile(file);
    setPicturePreview(URL.createObjectURL(file));
  };

  const clearPicture = () => {
    setPictureFile(null);
    if (picturePreview) URL.revokeObjectURL(picturePreview);
    setPicturePreview(null);
  };

  // ── Reset all including file ──
  const handleClose = () => {
    reset();
    clearPicture();
    setOpen(false);
  };

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      const { salary, ...rest } = data;

      const formData = new FormData();
      Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          formData.append(key, String(value));
        }
      });

      if (salary !== undefined) {
        formData.append("salary", String(salary));
      }

      if (pictureFile) {
        formData.append("picture", pictureFile);
      }

      const res = await registerUser(formData);
      //   console.log("Register res", res);
      if (res) {
        toast.success("Account created successfully!");
        handleClose();
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error("Registration failed. Please try again.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) handleClose();
        else setOpen(true);
      }}
    >
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button className={"cursor-pointer"}>
          <Plus className="h-4 w-4" />
          Add Staff
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm sm:max-w-[500] max-h-[90vh]  overflow-y-auto p-6">
        <div className="absolute left-0 right-0 top-0 h-0.5" />
        <DialogHeader className="flex flex-col items-center gap-2 pb-2 text-center">
          <DialogTitle className=" uppercase">Create Account</DialogTitle>
          <DialogDescription className="text-[#96999A] text-sm tracking-wide">
            Join Farin Fusion today
          </DialogDescription>
        </DialogHeader>
        <Separator />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="name"
              className="text-xs font-semibold tracking-widest uppercase"
            >
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              {...registerField("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-xs font-semibold tracking-widest uppercase"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...registerField("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label
              htmlFor="phone"
              className="text-xs font-semibold tracking-widest uppercase"
            >
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+880 1XXX-XXXXXX"
              {...registerField("phone")}
            />
            {errors.phone && (
              <p className="text-xs text-red-400">{errors.phone.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <Label
              htmlFor="address"
              className="text-xs font-semibold tracking-widest uppercase"
            >
              Address
            </Label>
            <Textarea
              id="address"
              placeholder="House no., Road, Area, City"
              rows={3}
              {...registerField("address")}
            />
            {errors.address && (
              <p className="text-xs text-red-400">{errors.address.message}</p>
            )}
          </div>

          {/* Picture Upload */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold tracking-widest uppercase">
              Profile Picture{" "}
              <span className="text-[#96999A] normal-case font-normal">
                (optional)
              </span>
            </Label>
            {picturePreview ? (
              <div className="relative  flex items-center gap-3 rounded-md border p-2">
                <Image
                  width={200}
                  height={200}
                  priority
                  quality={90}
                  src={picturePreview}
                  alt="Preview"
                  className="h-14 w-14 rounded-md object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#96999A]">
                    {pictureFile
                      ? (pictureFile.size / 1024).toFixed(1) + " KB"
                      : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearPicture}
                  className="shrink-0 rounded-full p-1 text-[#96999A] hover:text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="picture-upload"
                className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-[#4a5568] px-4 py-6 cursor-pointer
                                hover:bg-gray-200 transition-colors group"
              >
                <Upload className="h-6 w-6 text-black" />
                <div className="text-center">
                  <p className="text-sm">Click to upload photo</p>
                  <p className="text-xs text-[#96999A]/70">
                    PNG, JPG, WEBP — max 2MB
                  </p>
                </div>
                <input
                  id="picture-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          {/* Salary & Role — side by side */}
          <div className="grid grid-cols-1 gap-3">
            {/* Salary */}
            <div className="space-y-1.5">
              <Label
                htmlFor="salary"
                className="text-xs font-semibold tracking-widest uppercase"
              >
                Salary{" "}
                <span className="text-[#96999A] normal-case font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                id="salary"
                type="number"
                min={0}
                placeholder="e.g. 20,000"
                {...registerField("salary")}
              />
              {errors.salary && (
                <p className="text-xs text-red-400">{errors.salary.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="commissionSalary"
                className="text-xs font-semibold tracking-widest uppercase"
              >
                Commission Based Salary{" "}
                <span className="text-[#96999A] normal-case font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                id="commissionSalary"
                type="number"
                min={0}
                placeholder="e.g. 25"
                {...registerField("commissionSalary")}
              />
              {errors.commissionSalary && (
                <p className="text-xs text-red-400">
                  {errors?.commissionSalary?.message}
                </p>
              )}
            </div>

            {/* Role */}
            {/*<div className="space-y-2">*/}
            {/*    <Label>Role</Label>*/}
            {/*    <Select*/}
            {/*        onValueChange={(val) => setValue("role", val as Role, { shouldValidate: true })}*/}
            {/*        value={registerField("role").value as string} // controlled*/}
            {/*    >*/}
            {/*        <SelectTrigger>*/}
            {/*            <SelectValue placeholder="Select role" />*/}
            {/*        </SelectTrigger>*/}
            {/*        <SelectContent position="popper">*/}
            {/*            {Object.values(Role).map((r) => (*/}
            {/*                <SelectItem key={r} value={r}>*/}
            {/*                    {r}*/}
            {/*                </SelectItem>*/}
            {/*            ))}*/}
            {/*        </SelectContent>*/}
            {/*    </Select>*/}
            {/*    {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}*/}
            {/*</div>*/}

            <div className="space-y-2">
              <Label>Role</Label>
              <Controller
                name="role"
                control={control} // from useForm
                render={({ field }) => (
                  <Select
                    {...field} // connects value and onChange
                    onValueChange={(val) => field.onChange(val)} // update RHF state
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {Object.values(Role).map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <p className="text-xs text-red-500">{errors.role.message}</p>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-xs font-semibold tracking-widest uppercase"
            >
              Password
            </Label>
            <PasswordField
              id="password"
              placeholder="Create a password"
              registration={registerField("password")}
              error={errors.password?.message}
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label
              htmlFor="confirmPassword"
              className="text-xs font-semibold tracking-widest uppercase"
            >
              Confirm Password
            </Label>
            <PasswordField
              id="confirmPassword"
              placeholder="Re-enter your password"
              registration={registerField("confirmPassword")}
              error={errors.confirmPassword?.message}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 font-bold tracking-widest uppercase cursor-pointer transition-colors disabled:opacity-60"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0f1e0f] border-t-transparent" />
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
