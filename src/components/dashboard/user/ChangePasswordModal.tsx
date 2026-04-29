/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Eye, EyeOff, Copy, RefreshCw, User, Mail, Shield } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAdminChangePasswordMutation } from "@/redux/features/auth/auth.api";

export default function ChangePasswordModal({ open, onOpenChange, user }: any) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const [changePassword, { isLoading }] = useAdminChangePasswordMutation();

  const generatePassword = () => {
    const pass = Math.random().toString(36).slice(-8);
    setPassword(pass);
    toast.success("Password generated");
  };

  const copyPassword = () => {
    if (!password) return toast.error("No password to copy");
    navigator.clipboard.writeText(password);
    toast.success("Copied to clipboard");
  };

  const handleSubmit = async () => {
    if (!password) {
      return toast.error("Password required");
    }

    if (password.length < 6) {
      return toast.error("Minimum 6 characters required");
    }

    try {
      const res = await changePassword({
        userId: user._id,
        newPassword: password,
      }).unwrap();

      if (res) {
        toast.success("Password updated successfully");
        onOpenChange(false);
        setPassword("");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update password");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Change Password
          </DialogTitle>
        </DialogHeader>

        {/* USER INFO */}
        <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 space-y-1 text-sm">
          <p className="flex items-center gap-2">
            <User size={14} /> {user?.name}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Mail size={14} /> {user?.email}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Shield size={14} /> {user?.role}
          </p>
        </div>

        {/* PASSWORD FIELD */}
        <div className="relative mt-3">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* 👁 Toggle */}
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>

          {/* 📋 Copy */}
          <button
            type="button"
            onClick={copyPassword}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          >
            <Copy size={16} />
          </button>
        </div>

        {/* GENERATE BUTTON */}
        <Button
          variant="outline"
          onClick={generatePassword}
          className="w-full flex items-center gap-2"
        >
          <RefreshCw size={14} /> Generate Password
        </Button>

        {/* SUBMIT */}
        <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
