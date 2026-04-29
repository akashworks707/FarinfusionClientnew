/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Upload, X, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useUpdateUserMutation } from "@/redux/features/user/user.api";
import { IUser } from "@/types";
import Image from "next/image";
import PermissionSelector from "./PermissionSelector";
import type { PageAccess } from "@/lib/permissions";
import { defaultRolePermissions } from "@/lib/permissions";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  MODERATOR = "MODERATOR",
  TELLICELSS = "TELLICELSS",
  GENERALSTAFF = "GENERALSTAFF",
}

const updateUserSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
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
});

type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

interface UpdateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: () => void;
  user: IUser;
}

export default function UpdateUserModal({
  open,
  onOpenChange,
  refetch,
  user,
}: UpdateUserModalProps) {
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<PageAccess[]>(
    [],
  );
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema) as any,
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      address: user?.address ?? "",
      salary: user?.salary ?? undefined,
      commissionSalary: user?.commissionSalary ?? undefined,
      role: (user?.role as Role) ?? undefined,
    },
  });

  console.log(user);

  const selectedRole = watch("role");

  const initializePermissions = useCallback((role: Role, permissions?: any) => {
    const userRole = role ?? "MODERATOR";

    // ADMIN always gets ALL permissions
    if (userRole === "ADMIN") {
      return defaultRolePermissions["ADMIN"];
    }

    if (permissions && Array.isArray(permissions) && permissions.length > 0) {
      return permissions as PageAccess[];
    }

    return defaultRolePermissions[
      userRole as keyof typeof defaultRolePermissions
    ];
  }, []);

  useEffect(() => {
    if (user && user._id) {
      reset({
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        address: user.address ?? "",
        salary: user.salary ?? undefined,
        commissionSalary: user.commissionSalary ?? undefined,
        role: (user?.role as Role) ?? undefined,
      });
      setPicturePreview(user.picture ?? null);
      setPictureFile(null);

      // Initialize permissions with memoized function
      const permissionsToSet = initializePermissions(
        (user?.role as Role) ?? "MODERATOR",
        user?.permissions,
      );
      setSelectedPermissions(permissionsToSet);
    }
  }, [user?._id, reset, initializePermissions, user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    setPictureFile(file);
    if (picturePreview && picturePreview.startsWith("blob:")) {
      URL.revokeObjectURL(picturePreview);
    }
    setPicturePreview(URL.createObjectURL(file));
  };

  const clearPicture = () => {
    setPictureFile(null);
    if (picturePreview && picturePreview.startsWith("blob:")) {
      URL.revokeObjectURL(picturePreview);
    }
    setPicturePreview(null);
  };

  const handleClose = () => {
    reset();
    clearPicture();
    onOpenChange(false);
  };

  const onSubmit = async (data: UpdateUserFormValues) => {
    try {
      const { salary, ...rest } = data;
      const formData = new FormData();
      Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          formData.append(key, String(value));
        }
      });
      if (salary !== undefined) formData.append("salary", String(salary));
      if (pictureFile) formData.append("picture", pictureFile);

      // Add permissions as JSON string
      if (selectedPermissions.length > 0) {
        formData.append("permissions", JSON.stringify(selectedPermissions));
      }

      const res = await updateUser({ id: user._id, data: formData }).unwrap();
      if (res.success) {
        toast.success("User updated successfully with new permissions!");
        handleClose();
        refetch();
      }
    } catch (error) {
      console.error("Update user error:", error);
      toast.error("Update failed. Please try again.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => (val ? onOpenChange(true) : handleClose())}
    >
      <DialogContent className="p-0 bg-linear-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-950">
        <DialogHeader className="px-6 py-4 rounded-t-lg sticky bg-white top-0 z-10">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <span>✎</span> Update Staff Member
          </DialogTitle>
          <DialogDescription className="text-sm">
            Modify user profile, role, salary, and access permissions
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-2">
          <div className="px-6 py-4">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-linear-to-r from-amber-100 to-amber-50 dark:from-amber-950/40 dark:to-amber-900/20 p-1 rounded-lg mb-6">
                <TabsTrigger
                  value="general"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-amber-700 dark:data-[state=active]:text-amber-300 data-[state=active]:shadow-md transition-all"
                >
                  General Info
                </TabsTrigger>
                <TabsTrigger
                  value="permissions"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-amber-700 dark:data-[state=active]:text-amber-300 data-[state=active]:shadow-md transition-all"
                >
                  Permissions
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <TabsContent value="general" className="space-y-5">
                  {/* Admin Alert */}
                  {selectedRole === "ADMIN" && (
                    <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-900 dark:text-amber-100">
                        <p className="font-semibold">Admin Role Selected</p>
                        <p className="text-xs mt-1">
                          Admins automatically have access to all pages and
                          features in the system.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="font-semibold text-foreground"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., John Doe"
                      className="border-gray-300 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500 dark:focus:ring-amber-400"
                      {...registerField("name")}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 font-medium">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email & Phone Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Email */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="font-semibold text-foreground"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="user@example.com"
                        className="border-gray-300 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500"
                        {...registerField("email")}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 font-medium">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="font-semibold text-foreground"
                      >
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+880 1XXX-XXXXXX"
                        className="border-gray-300 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500"
                        {...registerField("phone")}
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-500 font-medium">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="font-semibold text-foreground"
                    >
                      Address <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="address"
                      rows={3}
                      placeholder="House no., Road, Area, City"
                      className="border-gray-300 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500 resize-none"
                      {...registerField("address")}
                    />
                    {errors.address && (
                      <p className="text-xs text-red-500 font-medium">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  {/* Picture */}
                  <div className="space-y-2">
                    <Label className="font-semibold text-foreground">
                      Profile Picture (Optional)
                    </Label>
                    {picturePreview ? (
                      <div className="flex items-center gap-4 border-2 border-amber-200 dark:border-amber-800/50 p-3 rounded-lg bg-amber-50/30 dark:bg-amber-950/20">
                        <Image
                          src={picturePreview}
                          alt="Preview"
                          width={500}
                          height={500}
                          priority
                          quality={90}
                          className="h-20 w-20 object-cover rounded-lg border-2 border-amber-200 dark:border-amber-700"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {pictureFile ? pictureFile.name : "Current photo"}
                          </p>
                          {pictureFile && (
                            <p className="text-xs text-muted-foreground">
                              {(pictureFile.size / 1024).toFixed(1)} KB
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                          onClick={clearPicture}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="picture-upload"
                        className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-amber-300 dark:border-amber-700 px-4 py-8 cursor-pointer hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-colors"
                      >
                        <Upload className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                        <div className="text-center">
                          <p className="text-sm font-medium text-foreground">
                            Click to upload photo
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
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

                  {/* Role & Salary Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="role"
                        className="font-semibold text-foreground"
                      >
                        Role <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={selectedRole ?? ""}
                        onValueChange={(val) => setValue("role", val as Role)}
                      >
                        <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500">
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
                      {errors.role && (
                        <p className="text-xs text-red-500 font-medium">
                          {errors.role.message}
                        </p>
                      )}
                    </div>

                    {/* Salary */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="salary"
                        className="font-semibold text-foreground"
                      >
                        Base Salary (Optional)
                      </Label>
                      <Input
                        id="salary"
                        type="number"
                        min={0}
                        placeholder="20,000"
                        className="border-gray-300 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500"
                        {...registerField("salary")}
                      />
                      {errors.salary && (
                        <p className="text-xs text-red-500 font-medium">
                          {errors.salary.message}
                        </p>
                      )}
                    </div>

                    {/* Commission */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="commissionSalary"
                        className="font-semibold text-foreground"
                      >
                        Commission % (Optional)
                      </Label>
                      <Input
                        id="commissionSalary"
                        type="number"
                        min={0}
                        placeholder="5%"
                        className="border-gray-300 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500"
                        {...registerField("commissionSalary")}
                      />
                      {errors.commissionSalary && (
                        <p className="text-xs text-red-500 font-medium">
                          {errors.commissionSalary.message}
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Permissions Tab */}
                <TabsContent value="permissions" className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      <span className="font-semibold">Note:</span>{" "}
                      {selectedRole === "ADMIN"
                        ? "Admin users automatically have access to all pages and cannot have restricted permissions."
                        : "Select which dashboard pages and features this user can access."}
                    </p>
                  </div>

                  {selectedRole === "ADMIN" ? (
                    <div className="p-6 text-center border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-lg bg-amber-50/30 dark:bg-amber-950/20">
                      <div className="inline-block p-3 bg-amber-100 dark:bg-amber-900/40 rounded-full mb-3">
                        <span className="text-2xl">👑</span>
                      </div>
                      <p className="font-semibold text-amber-900 dark:text-amber-100">
                        Full System Access
                      </p>
                      <p className="text-sm text-amber-800/70 dark:text-amber-200/70 mt-2">
                        Admins have unrestricted access to all pages, features,
                        and management tools in the system.
                      </p>
                    </div>
                  ) : (
                    <PermissionSelector
                      selectedPages={selectedPermissions}
                      onChange={setSelectedPermissions}
                      disabled={isLoading}
                    />
                  )}
                </TabsContent>

                {/* Footer - Always visible */}
                <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-slate-900/30 rounded-b-lg flex gap-3 justify-end sticky bottom-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="px-6 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="hover:cursor-pointer px-8 bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold transition-all duration-300 hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="inline-block animate-spin">⟳</span>
                        Updating...
                      </span>
                    ) : (
                      "✓ Update User"
                    )}
                  </Button>
                </div>
              </form>
            </Tabs>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
