"use client"

import { usePathname , useRouter} from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function CartBreadcrumb() {
  const router = useRouter()
  const pathname = usePathname()

  const isCart = pathname === "/cart"
  const isCheckout = pathname === "/checkout"
  const isComplete = pathname === "/order-complete"

  const baseStyle = "cursor-pointer px-2 py-1 text-gray-300 transition-all duration-300"

  const activeStyle =
    "text-white font-semibold border-b-3 border-amber-400 hover:text-amber-400"

  const hoverStyle = "hover:text-amber-400"

  return (
    <Breadcrumb className="container mx-auto px-4 py-5">
      <BreadcrumbList className="px-2 sm:px-8 text-sm sm:text-md md:text-lg bg-[#2D3436] text-white py-6 rounded-xl flex items-center ">

        {/* CART */}
        <BreadcrumbItem>
          <BreadcrumbLink
            onClick={() => router.push("/cart")}
            className={`${baseStyle} ${isCart ? activeStyle : hoverStyle}`}
          >
            SHOPPING
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator className="text-gray-400" />

        {/* CHECKOUT */}
        <BreadcrumbItem>
          <BreadcrumbLink
            // onClick={() => router.push("/checkout")}
            className={`${baseStyle} ${isCheckout ? activeStyle : hoverStyle}`}
          >
            CHECKOUT
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator className="text-gray-400" />

        {/* ORDER COMPLETE */}
        <BreadcrumbItem>
          <BreadcrumbPage
            className={`${baseStyle} ${isComplete ? activeStyle : ""}`}
          >
            ORDER COMPLETE
          </BreadcrumbPage>
        </BreadcrumbItem>

      </BreadcrumbList>
    </Breadcrumb>
  )
}