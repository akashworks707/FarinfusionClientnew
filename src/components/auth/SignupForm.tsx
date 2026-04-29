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
import { Textarea } from '@/components/ui/textarea'

import Image from 'next/image'
import logo from "../../../public/assets/FRN-Logo-scaled.webp"
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { registerUser } from '@/utils/registerUser'
import { loginUser } from '@/utils/loginUser'
import { useUser } from '@/context/UserContext'

// ─── Schema ────────────────────────────────────────────────────────────────────

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

// ─── Props ─────────────────────────────────────────────────────────────────────

interface RegisterFormProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

// ─── Password field helper ─────────────────────────────────────────────────────

function PasswordField({
  id,
  placeholder,
  registration,
  error,
}: {
  id: string
  placeholder: string
  registration: object
  error?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        {...registration}
        className="
          border-[#4a5568] bg-[#1e2829]
          text-white placeholder:text-[#96999A] pr-10
          focus-visible:ring-[#c9a84c] focus-visible:border-[#c9a84c]
          transition-colors
        "
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#96999A] hover:text-[#c9a84c] transition-colors"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function RegisterForm({ isOpen, onClose, onSwitchToLogin }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useUser();
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true)

      const formData = new FormData()

      const payload = {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        password: data.password,
      }

      formData.append('data', JSON.stringify(payload))

      const res = await registerUser(formData)
      if (res.success) {
        toast.success('Register successful!')
        reset();
        const loggedInUser = await loginUser({ email: data.email, password: data.password })
        login(loggedInUser.user.user)
        if (loggedInUser.user.user.role === 'CUSTOMER') {
          router.push('/staff/dashboard')
        } else if (
          loggedInUser.user.user.role === 'MODERATOR' ||
          loggedInUser.user.user.role === 'TELLICELSS' ||
            loggedInUser.user.user.role === 'MANAGER' ||
            loggedInUser.user.user.role === 'ADMIN'
        ) {
          router.push('/staff/dashboard')
        } else {
          router.push('/')
        }
        onClose()
      } else {
        toast.error(res.message || 'Registration failed')
      }
    } catch (error) {
      console.error(error)
      toast.error('Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="
          sm:max-w-md max-h-[90vh] overflow-y-auto
          border border-[#4a5568]
          bg-[#2D3436]
          text-white
          p-6
        "
      >
        {/* Gold accent line */}
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
            Create Account
          </DialogTitle>
          <DialogDescription className="text-[#96999A] text-sm tracking-wide">
            Join Farin Fusion today
          </DialogDescription>
        </DialogHeader>

        {/* Divider */}
        <div className="my-1 h-px bg-[#3d4f51]" />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">

          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              {...register('fullName')}
              className="
                border-[#4a5568] bg-[#1e2829]
                text-white placeholder:text-[#96999A]
                focus-visible:ring-[#c9a84c] focus-visible:border-[#c9a84c]
                transition-colors
              "
            />
            {errors.fullName && (
              <p className="text-xs text-red-400">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
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

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+880 1XXX-XXXXXX"
              {...register('phone')}
              className="
                border-[#4a5568] bg-[#1e2829]
                text-white placeholder:text-[#96999A]
                focus-visible:ring-[#c9a84c] focus-visible:border-[#c9a84c]
                transition-colors
              "
            />
            {errors.phone && (
              <p className="text-xs text-red-400">{errors.phone.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              Address
            </Label>
            <Textarea
              id="address"
              placeholder="House no., Road, Area, City"
              rows={3}
              {...register('address')}
              className="
                border-[#4a5568] bg-[#1e2829]
                text-white placeholder:text-[#96999A]
                focus-visible:ring-[#c9a84c] focus-visible:border-[#c9a84c]
                resize-none transition-colors
              "
            />
            {errors.address && (
              <p className="text-xs text-red-400">{errors.address.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              Password
            </Label>
            <PasswordField
              id="password"
              placeholder="Create a password"
              registration={register('password')}
              error={errors.password?.message}
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              Confirm Password
            </Label>
            <PasswordField
              id="confirmPassword"
              placeholder="Re-enter your password"
              registration={register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="
              w-full mt-2
              bg-[#c9a84c] hover:bg-[#d4b86a]
              text-[#0f1e0f] font-bold tracking-widest uppercase
              transition-colors disabled:opacity-60
            "
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0f1e0f] border-t-transparent" />
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-1 h-px bg-[#3d4f51]" />

        {/* Switch to login */}
        <p className="text-center text-sm text-[#96999A]">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => { onClose(); onSwitchToLogin() }}
            className="text-[#c9a84c] font-semibold hover:underline transition-opacity"
          >
            Log in
          </button>
        </p>
      </DialogContent>
    </Dialog>
  )
}