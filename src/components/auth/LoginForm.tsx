
"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

import Image from 'next/image'
import logo from "../../../public/assets/FRN-Logo-scaled.webp"
import { toast } from 'sonner'
import { loginUser } from '@/utils/loginUser'
import { useUser } from '@/context/UserContext'
import {useRouter} from "next/navigation";


const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LoginFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
  onSwitchToForgot?: () => void;
}

export function LoginForm({
  isOpen,
  onClose,
  onSwitchToSignup,
  onSwitchToForgot,
}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useUser();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
     setIsLoading(true)
        const res = await loginUser(data);

        if (res.success) {
            login(res.user.user);
            if (res.user.user.role === "CUSTOMER" || res.user.user.role === "GENERALSTAFF") {
                router.push("/staff/dashboard");
            } else if ((res.user.user.role === "MANAGER") || (res.user.user.role === "MODERATOR"
             || (res.user.user.role === "ADMIN") || (res.user.user.role === "TELLICELSS")
            )) {
                router.push("/staff/dashboard");
            } else {
                router.push("/");
            }
            toast.success("Login successful!");
            setIsLoading(false)
            onClose();
        } else {
            toast.error(res.message || "Login failed!");
            setIsLoading(false)
        }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="
          sm:max-w-md max-h-[90vh] overflow-y-auto
          border border-[#c9a84c]
          bg-[#2D3436]
          text-white
          p-6
        "
      >
        {/* Gold accent line at top */}
        <div className="absolute left-0 right-0 top-0 h-0.5 rounded-t-lg bg-linear-to-r from-transparent via-[#c9a84c] to-transparent" />

        {/* Header */}
        <DialogHeader className="flex flex-col items-center gap-2 pb-2">
          <Image
            src={logo}
            alt="Farin Fusion"
            height={60}
            width={120}
            className="object-contain"
          />
          <DialogTitle className="text-xl font-bold tracking-widest text-[#c9a84c] uppercase">
            Welcome Back
          </DialogTitle>
          <DialogDescription className="text-[#96999A] text-sm tracking-wide">
            Log in to continue to Farin Fusion
          </DialogDescription>
        </DialogHeader>

        {/* Divider */}
        <div className="my-1 h-px bg-[#3d4f51]" />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">

          {/* Email */}
          <div className="space-y-1.5">
            <Label className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              Email Address
            </Label>
            <Input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className="
                border-[#4a5568] bg-[#1e2829]
                text-white placeholder:text-[#96999A]
                focus-visible:ring-[#c9a84c] focus-visible:border-[#c9a84c]
                transition-colors
              "
            />
            {errors.email && (
              <p className="text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className="
                  border-[#4a5568] bg-[#1e2829]
                  text-white placeholder:text-[#96999A] pr-10
                  focus-visible:ring-[#c9a84c] focus-visible:border-[#c9a84c]
                  transition-colors
                "
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#96999A] hover:text-[#c9a84c] transition-colors"
              >
                {showPassword
                  ? <EyeOff className="h-4 w-4" />
                  : <Eye className="h-4 w-4" />
                }
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => { onClose(); onSwitchToForgot?.(); }}
              className="text-xs text-[#c9a84c] hover:underline transition-opacity font-medium"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="
              w-full
              bg-[#c9a84c] hover:bg-[#d4b86a]
              text-[#0f1e0f] font-bold tracking-widest uppercase
              transition-colors disabled:opacity-60
            "
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0f1e0f] border-t-transparent" />
                Logging in...
              </span>
            ) : (
              "Log In"
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-1 h-px bg-[#3d4f51]" />

        {/* Switch to signup */}
        <p className="text-center text-sm text-[#96999A]">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => { onClose(); onSwitchToSignup(); }}
            className="text-[#c9a84c] font-semibold hover:underline transition-opacity"
          >
            Sign up
          </button>
        </p>
      </DialogContent>
    </Dialog>
  )
}